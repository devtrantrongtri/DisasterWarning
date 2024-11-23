import pandas as pd
import numpy as np
import logging
import warnings
from typing import Dict, List, Any, Optional, Tuple
import os

from sklearn.preprocessing import StandardScaler, MultiLabelBinarizer
from sklearn.model_selection import train_test_split, GridSearchCV, KFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import classification_report, f1_score, precision_score, recall_score
from sklearn.impute import KNNImputer
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.utils.class_weight import compute_class_weight
import xgboost as xgb
import joblib
from scipy import stats

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')
logger = logging.getLogger(__name__)
warnings.filterwarnings('ignore')

class OptimizedDisasterPredictionModel:
    def __init__(self, n_jobs: int = -1, random_state: int = 42):
        self.n_jobs = n_jobs
        self.random_state = random_state
        self.weather_scaler = StandardScaler()
        self.knn_imputer = KNNImputer(n_neighbors=5)
        self.models = self._initialize_models()
        self.best_model = None
        self.best_model_name = None
        self.feature_importance = None
        self.model_performance = {}
        self.disaster_types = ['flood', 'storm', 'drought', 'cold_wave', 'fog', 'tornado', 'lightning', 'landslide', 'flash_flood']
        self.threshold_dict = {}

    def _initialize_models(self) -> Dict[str, Any]:
        models = {
            'random_forest': MultiOutputClassifier(RandomForestClassifier(n_estimators=200, max_depth=15, min_samples_split=5, n_jobs=self.n_jobs, random_state=self.random_state, class_weight='balanced')),
            'xgboost': MultiOutputClassifier(xgb.XGBClassifier(n_estimators=150, max_depth=8, learning_rate=0.05, n_jobs=self.n_jobs, random_state=self.random_state, use_label_encoder=False, eval_metric='logloss'))
        }
        return models

    def prepare_features(self, weather_data: pd.DataFrame) -> pd.DataFrame:
        features = weather_data.copy()
        features['timestamp'] = pd.to_datetime(features['timestamp'])
        features['day_of_year'] = features['timestamp'].dt.dayofyear
        features['month'] = features['timestamp'].dt.month
        features['day_of_week'] = features['timestamp'].dt.dayofweek
        
        weather_params = ['temp_c', 'humidity', 'wind_kph', 'pressure_mb', 'precip_mm']
        rolling_windows = [3, 7, 14]

        for window in rolling_windows:
            for param in weather_params:
                features[f'{param}_mean_{window}d'] = features[param].rolling(window=window, min_periods=1).mean()
                features[f'{param}_std_{window}d'] = features[param].rolling(window=window, min_periods=1).std()
                features[f'{param}_max_{window}d'] = features[param].rolling(window=window, min_periods=1).max()
                features[f'{param}_min_{window}d'] = features[param].rolling(window=window, min_periods=1).min()

        features['heat_index'] = self._calculate_heat_index(features['temp_c'], features['humidity'])
        features['wind_chill'] = self._calculate_wind_chill(features['temp_c'], features['wind_kph'])
        features['dew_point'] = self._calculate_dew_point(features['temp_c'], features['humidity'])

        zscore = stats.zscore(features[weather_params], axis=0, nan_policy='omit')
        features[[f'{param}_is_anomaly' for param in weather_params]] = (np.abs(zscore) > 3).astype(int)

        risk_functions = {
            'flood': self._calculate_flood_risk,
            'storm': self._calculate_storm_risk,
            'drought': self._calculate_drought_risk,
            'cold_wave': self._calculate_cold_wave_risk,
            'fog': self._calculate_fog_risk,
            'tornado': self._calculate_tornado_risk,
            'lightning': self._calculate_lightning_risk,
            'landslide': self._calculate_landslide_risk,
            'flash_flood': self._calculate_flash_flood_risk
        }

        for disaster_type, risk_func in risk_functions.items():
            features[f'{disaster_type}_risk'] = risk_func(features)

        return self._handle_missing_values(features)

    @staticmethod
    def preprocess_disaster_data(disaster_data_path: str, weather_data: pd.DataFrame) -> pd.DataFrame:
        disaster_data = pd.read_csv(disaster_data_path)
        disaster_data['date'] = pd.to_datetime(disaster_data['date'])
        disaster_types_mapping = {
            'flood': ['flood', 'flooding', 'inundation'],
            'storm': ['storm', 'typhoon', 'hurricane', 'cyclone', 'tempest'],
            'drought': ['drought', 'dry', 'water shortage'],
            'cold_wave': ['cold', 'freeze', 'frost', 'cold wave', 'freezing'],
            'fog': ['fog', 'mist', 'haze'],
            'tornado': ['tornado', 'twister', 'whirlwind'],
            'lightning': ['lightning', 'thunderstorm', 'thunder', 'electrical storm'],
            'landslide': ['landslide', 'mudslide', 'rockslide', 'earth movement'],
            'flash_flood': ['flash flood', 'rapid flood', 'sudden flood']
        }

        unique_dates = weather_data['timestamp'].dt.date.unique()
        disaster_labels = pd.DataFrame(0, index=unique_dates, columns=list(disaster_types_mapping.keys()))

        for _, row in disaster_data.iterrows():
            row_date = row['date'].date()
            disaster_type = str(row['disaster_type']).lower()
            for label, patterns in disaster_types_mapping.items():
                if any(pattern in disaster_type for pattern in patterns):
                    if row_date in disaster_labels.index:
                        disaster_labels.loc[row_date, label] = 1

        disaster_labels.reset_index(inplace=True)
        disaster_labels.rename(columns={'index': 'date'}, inplace=True)
        weather_data['date'] = weather_data['timestamp'].dt.date
        merged_data = weather_data.merge(disaster_labels, on='date', how='left').fillna(0)

        return merged_data

    def _advanced_feature_selection(self, X: pd.DataFrame, y: Optional[pd.DataFrame] = None, training: bool = False) -> Tuple[pd.DataFrame, List[str]]:
        base_features = [
            'pressure_mb', 'feelslike_c', 'dewpoint_c', 'month', 
            'day_of_year', 'day_of_week', 'temp_c_mean_3d', 
            'temp_c_max_3d', 'temp_c_min_3d', 'pressure_mb_mean_3d',
            'pressure_mb_max_3d', 'pressure_mb_min_3d', 'temp_c_mean_7d',
            'temp_c_max_7d', 'wind_kph_mean_7d', 'pressure_mb_mean_7d',
            'pressure_mb_max_7d', 'pressure_mb_min_7d', 'precip_mm_mean_7d',
            'precip_mm_std_7d', 'precip_mm_max_7d', 'temp_c_mean_14d',
            'temp_c_std_14d', 'temp_c_max_14d', 'temp_c_min_14d',
            'wind_kph_mean_14d', 'pressure_mb_mean_14d', 'pressure_mb_max_14d',
            'pressure_mb_min_14d', 'precip_mm_mean_14d', 'precip_mm_std_14d',
            'precip_mm_max_14d', 'precip_mm_min_14d', 'heat_index', 'wind_chill', 'dew_point', 
            'temp_c_is_anomaly', 'humidity_is_anomaly', 'wind_kph_is_anomaly', 
            'pressure_mb_is_anomaly', 'precip_mm_is_anomaly', 'flood_risk', 
            'storm_risk', 'drought_risk', 'cold_wave_risk', 'fog_risk', 
            'tornado_risk', 'lightning_risk', 'landslide_risk',  'flash_flood_risk'
        ]

        if training:
            self.selected_features = base_features
            logger.info("Training mode: Saving base features as selected features.")

        missing_features = [feat for feat in base_features if feat not in X.columns]
        for feat in missing_features:
            X[feat] = 0
            logger.warning(f"Missing feature: '{feat}' added with zeros.")

        X_selected = X[base_features]

        if training and y is not None:
            try:
                selector = SelectKBest(score_func=f_classif, k=min(20, len(base_features)))
                selected_features_mask = np.zeros(len(base_features), dtype=bool)

                for i in range(y.shape[1]):
                    selector.fit(X_selected, y.iloc[:, i])
                    selected_features_mask |= selector.get_support()

                self.selected_features = [base_features[i] for i in range(len(base_features)) if selected_features_mask[i]]
                logger.info(f"Selected features after selection: {self.selected_features}")
                return X_selected[self.selected_features], self.selected_features

            except Exception as e:
                logger.error(f"Error during feature selection: {e}")
                return X_selected, base_features

        return X_selected[self.selected_features] if hasattr(self, 'selected_features') else X_selected[base_features], \
               self.selected_features if hasattr(self, 'selected_features') else base_features

    def _handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        df[numeric_columns] = self.knn_imputer.fit_transform(df[numeric_columns])
        return df

    def _calculate_heat_index(self, temp_c: pd.Series, humidity: pd.Series) -> pd.Series:
        temp_f = temp_c * 9/5 + 32
        hi = 0.5 * (temp_f + 61.0 + ((temp_f - 68.0) * 1.2) + (humidity * 0.094))
        return (hi - 32) * 5/9

    def _calculate_wind_chill(self, temp_c: pd.Series, wind_kph: pd.Series) -> pd.Series:
        temp_f = temp_c * 9/5 + 32
        wind_mph = wind_kph * 0.621371
        wc = 35.74 + (0.6215 * temp_f) - (35.75 * (wind_mph ** 0.16)) + (0.4275 * temp_f * (wind_mph ** 0.16))
        return (wc - 32) * 5/9

    def _calculate_dew_point(self, temp_c: pd.Series, humidity: pd.Series) -> pd.Series:
        a = 17.27
        b = 237.7
        alpha = ((a * temp_c) / (b + temp_c)) + np.log(humidity / 100.0)
        return (b * alpha) / (a - alpha)

    def _calculate_flood_risk(self, features: pd.DataFrame) -> pd.Series:
        return (features['precip_mm'] * features['humidity'] / 100) * 0.7 + \
            (features['pressure_mb'] < 1000).astype(int) * 0.3

    def _calculate_storm_risk(self, features: pd.DataFrame) -> pd.Series:
        return (features['wind_kph'] * features['temp_c'] / 30) * 0.6 + \
            (features['pressure_mb'] < 990).astype(int) * 0.4

    def _calculate_drought_risk(self, features: pd.DataFrame) -> pd.Series:
        return ((100 - features['humidity']) * features['temp_c'] / 40) * 0.8 + \
            (features['precip_mm'] < 5).astype(int) * 0.2

    def _calculate_cold_wave_risk(self, features: pd.DataFrame) -> pd.Series:
        return ((0 - features['temp_c']) * features['wind_kph'] / 20) * 0.7 + \
            (features['temp_c'] < 5).astype(int) * 0.3

    def _calculate_fog_risk(self, features: pd.DataFrame) -> pd.Series:
        return (features['humidity'] * features['wind_kph'] / 50) * 0.6 + \
            (features['temp_c'] - features['dew_point'] < 2).astype(int) * 0.4

    def _calculate_tornado_risk(self, features: pd.DataFrame) -> pd.Series:
        return (features['wind_kph'] ** 2 / 1000) * 0.7 + \
            (features['temp_c'] > 30).astype(int) * 0.3

    def _calculate_lightning_risk(self, features: pd.DataFrame) -> pd.Series:
        return (features['temp_c'] * features['humidity'] / 100) * 0.6 + \
            (features['pressure_mb'] < 1000).astype(int) * 0.4

    def _calculate_landslide_risk(self, features: pd.DataFrame) -> pd.Series:
        return (features['precip_mm'] * features['humidity'] / 100) * 0.8

    def _calculate_flash_flood_risk(self, features: pd.DataFrame) -> pd.Series:
        return (features['precip_mm'] > 50).astype(int) * 0.8 + \
            (features['temp_c'] > 25).astype(int) * 0.2

    def _tune_hyperparameters(self, X_train: pd.DataFrame, y_train: pd.DataFrame) -> None:
        rf_params = {
            'estimator__n_estimators': [100, 200, 300],
            'estimator__max_depth': [10, 15, 20],
            'estimator__min_samples_split': [2, 5, 10]
        }

        xgb_params = {
            'estimator__n_estimators': [100, 200, 300],
            'estimator__learning_rate': [0.01, 0.05, 0.1],
            'estimator__max_depth': [3, 6, 9],
            'estimator__scale_pos_weight': [3, 5, 7]
        }

        cv = KFold(n_splits=5, shuffle=True, random_state=self.random_state)

        for name, model in self.models.items():
            try:
                param_grid = rf_params if name == 'random_forest' else xgb_params
                grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=cv, scoring='f1_weighted', n_jobs=self.n_jobs, verbose=1)
                grid_search.fit(X_train, y_train)
                self.models[name] = grid_search.best_estimator_
                logger.info(f"Best params for {name}: {grid_search.best_params_}")
            except Exception as e:
                logger.error(f"Error in hyperparameter tuning for {name}: {e}")
                model.fit(X_train, y_train)

    def train_models(self, X_train: pd.DataFrame, y_train: pd.DataFrame) -> None:
        try:
            X_train_selected, selected_features = self._advanced_feature_selection(X_train, y_train, training=True)
            logger.info(f"Selected features: {selected_features}")

            class_weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train.values.ravel())
            self.class_weights = {i: class_weights[i] for i in range(len(class_weights))}

            self._tune_hyperparameters(X_train_selected, y_train)

            best_score = 0
            for name, model in self.models.items():
                model.fit(X_train_selected, y_train)
                y_pred = model.predict(X_train_selected)

                f1_scores = [f1_score(y_train.iloc[:, i], y_pred[:, i], average='weighted') for i in range(y_train.shape[1])]
                avg_f1_score = np.mean(f1_scores)

                logger.info(f"\nF1 scores for model {name}:")
                for i, score in enumerate(f1_scores):
                    logger.info(f"{y_train.columns[i]}: {score:.4f}")
                logger.info(f"Average F1 score: {avg_f1_score:.4f}")

                if avg_f1_score > best_score:
                    best_score = avg_f1_score
                    self.best_model = model
                    self.best_model_name = name

            self._calculate_model_performance(y_train.values, self.best_model.predict(X_train_selected))

        except Exception as e:
            logger.error(f"Error during model training: {e}", exc_info=True)

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        X_selected, _ = self._advanced_feature_selection(X, training=False)
        return self.best_model.predict(X_selected)

    @classmethod
    def load_model(cls, filename: str) -> 'OptimizedDisasterPredictionModel':
        model_path = os.path.join('models', filename)
        model_data = joblib.load(model_path)
        predictor = cls()
        predictor.best_model = model_data['model']
        predictor.weather_scaler = model_data['scaler']
        predictor.feature_importance = model_data.get('feature_importance')
        predictor.selected_features = model_data['selected_features']
        predictor.threshold_dict = model_data.get('threshold_dict', {})
        predictor.model_performance = model_data.get('model_performance', {})
        predictor.class_weights = model_data.get('class_weights')
        return predictor

    def _calculate_model_performance(self, y_true: np.ndarray, y_pred: np.ndarray) -> None:
        self.model_performance['f1_score'] = f1_score(y_true, y_pred, average='micro')
        self.model_performance['precision'] = precision_score(y_true, y_pred, average='micro')
        self.model_performance['recall'] = recall_score(y_true, y_pred, average='micro')
        self.model_performance['classification_report'] = classification_report(y_true, y_pred)

        logger.info("Model performance metrics calculated and stored.")

    def save_model(self, filename: str) -> None:
        model_path = os.path.join('models', filename)
        model_data = {
            'model': self.best_model,
            'scaler': self.weather_scaler,
            'feature_importance': self.feature_importance,
            'disaster_types': self.disaster_types,
            'threshold_dict': self.threshold_dict,
            'selected_features': self.selected_features,
            'model_performance': self.model_performance,
            'class_weights': getattr(self, 'class_weights', None)
        }
        joblib.dump(model_data, model_path)
        logger.info(f"Model saved to {model_path}")

    def print_model_info(self):
        logger.info("Model Information:")
        logger.info(f"Best Model Name: {self.best_model_name}")
        logger.info(f"Model Parameters: {self.best_model.get_params()}")
        logger.info(f"Selected Features: {self.selected_features}")
        logger.info(f"Class Weights: {self.class_weights}")
        logger.info(f"Model Performance: {self.model_performance}")
        logger.info(f"Feature Importance: {self.feature_importance}")

def main():
    try:
        weather_data = pd.read_csv('data/processed_weather_data.csv')
        weather_data['timestamp'] = pd.to_datetime(weather_data['timestamp'])
        disaster_data = pd.read_csv('data/processed_disaster_data.csv')

        processed_data = OptimizedDisasterPredictionModel.preprocess_disaster_data('data/processed_disaster_data.csv', weather_data)

        disaster_columns = ['flood', 'storm', 'drought', 'cold_wave', 'fog', 'tornado', 'lightning', 'landslide', 'flash_flood']
        
        logger.info("\nClass distribution:")
        for col in disaster_columns:
            if col in processed_data.columns:
                value_counts = processed_data[col].value_counts()
                logger.info(f"\n{col}:\n{value_counts}")

        model = OptimizedDisasterPredictionModel(n_jobs=-1)
        X = model.prepare_features(processed_data)

        available_disaster_columns = [col for col in disaster_columns if col in processed_data.columns]
        
        if not available_disaster_columns:
            raise ValueError("No disaster columns found in the data")
        
        y = processed_data[available_disaster_columns]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model.train_models(X_train, y_train)
        model.print_model_info()

        model.save_model('disaster_prediction_model_v2.joblib')

        loaded_model = OptimizedDisasterPredictionModel.load_model('disaster_prediction_model_v2.joblib')
        predictions = loaded_model.predict(X_test)

        logger.info("\nTest Set Evaluation:")
        for i, disaster_type in enumerate(available_disaster_columns):
            precision = precision_score(y_test.iloc[:, i], predictions[:, i])
            recall = recall_score(y_test.iloc[:, i], predictions[:, i])
            f1 = f1_score(y_test.iloc[:, i], predictions[:, i])
            
            logger.info(f"\n{disaster_type}:")
            logger.info(f"Precision: {precision:.4f}")
            logger.info(f"Recall: {recall:.4f}")
            logger.info(f"F1-score: {f1:.4f}")

        logger.info("\nOverall Classification Report:")
        logger.info(classification_report(y_test, predictions, target_names=available_disaster_columns))

    except Exception as e:
        logger.error("An error occurred: %s", e, exc_info=True)

if __name__ == "__main__":
    main()