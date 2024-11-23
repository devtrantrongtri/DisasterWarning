import pandas as pd
import numpy as np
import json
import glob
import concurrent.futures
from datetime import datetime

class DataProcessor:
    def __init__(self):
        # Các feature cho dữ liệu thời tiết và thiên tai
        self.numerical_features = [
            'temp_c', 'humidity', 'wind_kph', 'pressure_mb',
            'precip_mm', 'cloud', 'feelslike_c', 'dewpoint_c',
            'wind_degree', 'gust_kph'
        ]
        self.categorical_features = ['condition_text', 'is_day']
        self.datetime_features = ['hour', 'month']
        self.weather_features = self.numerical_features + self.categorical_features + self.datetime_features + ['timestamp']
        self.disaster_features = ['disaster_name', 'description', 'date']

    def load_json_files(self, data_path, prefix):
        """Tải tất cả file JSON từ thư mục data với prefix xác định."""
        json_files = glob.glob(f"{data_path}/{prefix}_*.json")
        all_data = []

        # Sử dụng ThreadPoolExecutor để tải file song song
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = {executor.submit(self.load_json_file, file_path): file_path for file_path in json_files}
            for future in concurrent.futures.as_completed(futures):
                data = future.result()
                if data is not None:
                    all_data.append(data)

        return all_data

    def load_json_file(self, file_path):
        """Tải một file JSON."""
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading file {file_path}: {e}")
            return None

    def extract_weather_features(self, json_data):
        records = []
        for data in json_data:
            try:
                for forecast_day in data['forecast']['forecastday']:
                    records.extend([
                        {
                            'temp_c': hour.get('temp_c', np.nan),
                            'humidity': hour.get('humidity', np.nan),
                            'wind_kph': hour.get('wind_kph', np.nan),
                            'pressure_mb': hour.get('pressure_mb', np.nan),
                            'precip_mm': hour.get('precip_mm', np.nan),
                            'cloud': hour.get('cloud', np.nan),
                            'feelslike_c': hour.get('feelslike_c', np.nan),
                            'dewpoint_c': hour.get('dewpoint_c', np.nan),
                            'wind_degree': hour.get('wind_degree', np.nan),
                            'gust_kph': hour.get('gust_kph', np.nan),
                            'is_day': hour.get('is_day', np.nan),
                            'condition_text': hour.get('condition', {}).get('text', 'Unknown'),
                            'hour': pd.to_datetime(hour.get('time')).hour,
                            'month': pd.to_datetime(hour.get('time')).month,
                            'timestamp': pd.to_datetime(hour.get('time'))
                        }
                        for hour in forecast_day['hour'] if 'time' in hour
                    ])
            except KeyError as e:
                print(f"Missing key in JSON structure: {e}")
            except Exception as e:
                print(f"Unexpected error processing record: {e}")

        df = pd.DataFrame(records)
        numeric_columns = [col for col in df.columns if col != 'condition_text' and col != 'timestamp']
        df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric, errors='coerce')
        df.set_index('timestamp', inplace=True)
        df.sort_index(inplace=True)
        return df

    def extract_disaster_features(self, json_data):
        records = []
        disaster_types = {
            'flood': [
                'flood', 'flooding', 'inundated', 'flash flood', 
                'overflow', 'deluge', 'waterlogged', 'rising water'
            ],
            'storm': [
                'storm', 'tornado', 'hurricane', 'cyclone', 
                'typhoon', 'thunderstorm', 'gale', 'squall', 'strong wind', 
                'violent storm', 'tropical storm'
            ],
            'landslide': [
                'landslide', 'rockslide', 'mudslide', 'erosion', 
                'slope failure', 'debris flow', 'ground movement', 
                'earth collapse', 'terrain slide'
            ],
            'drought': [
                'drought', 'dry spell', 'water shortage', 'drought-hit', 
                'arid conditions', 'desertification', 'prolonged dry period'
            ],
            'heavy_rain': [
                'heavy rain', 'torrential rain', 'downpour', 'rainstorm', 
                'monsoon', 'persistent rain', 'cloudburst', 'intense rainfall'
            ],
            'heat_wave': [
                'heat wave', 'extreme heat', 'scorching heat', 'high temperature', 
                'hot spell', 'prolonged heat', 'heat advisory'
            ],
            'cold_wave': [
                'cold wave', 'extreme cold', 'freezing weather', 'cold spell', 
                'low temperature', 'frost', 'sub-zero temperatures', 'cold advisory'
            ],
            'wildfire': [
                'wildfire', 'bushfire', 'forest fire', 'grass fire', 
                'uncontrolled fire', 'blaze', 'flames', 'fire hazard'
            ],
            'earthquake': [
                'earthquake', 'seismic activity', 'tremor', 'quake', 
                'aftershock', 'seismic tremor', 'ground shaking', 'fault slip'
            ],
            'tsunami': [
                'tsunami', 'tidal wave', 'sea surge', 'seismic wave', 
                'oceanic disturbance', 'giant wave', 'coastal flooding'
            ],
            'volcanic_eruption': [
                'volcanic eruption', 'volcano', 'lava flow', 'ash cloud', 
                'pyroclastic flow', 'eruption', 'volcanic activity', 'magma release'
            ]
        }

        def extract_date(title):
            """Trích xuất ngày từ tiêu đề."""
            import re
            patterns = [
                r'\((\d{1,2}\s+\w+\s+\d{4})\)',
                r'(\d{1,2}\s+\w+\s+\d{4})',
                r'as of (\d{1,2}\s+\w+\s+\d{4})',
            ]
            for pattern in patterns:
                match = re.search(pattern, title)
                if match:
                    try:
                        return pd.to_datetime(match.group(1))
                    except Exception:
                        continue
            return None

        def identify_disaster_type(title):
            """Xác định loại thiên tai."""
            title_lower = title.lower()
            for disaster_type, keywords in disaster_types.items():
                if any(keyword in title_lower for keyword in keywords):
                    return disaster_type
            return 'other'

        for data_file in json_data:
            try:
                if 'data' not in data_file:
                    continue

                for report in data_file['data']:
                    if 'fields' not in report or 'title' not in report['fields']:
                        continue

                    title = report['fields']['title']
                    date = extract_date(title)
                    if not date:
                        continue

                    disaster_type = identify_disaster_type(title)
                    record = {
                        'id': report.get('id', 'unknown'),
                        'date': date,
                        'disaster_type': disaster_type,
                        'title': title,
                        'href': report.get('href', ''),
                    }
                    records.append(record)

            except Exception as e:
                print(f"Error processing data file: {str(e)}")
                continue

        df = pd.DataFrame(records)
        if not df.empty:
            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date')
            df = df.drop_duplicates(subset=['date', 'disaster_type'], keep='first')
        return df

    def handle_missing_values(self, df):
        df.fillna(method='ffill', inplace=True)
        df.fillna(method='bfill', inplace=True)
        df.fillna(0, inplace=True)  # Default fallback for missing values
        return df

    def remove_outliers(self, df):
        for feature in self.numerical_features:
            if feature in df.columns:
                Q1 = df[feature].quantile(0.25)
                Q3 = df[feature].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                df[feature] = np.clip(df[feature], lower_bound, upper_bound)
        return df

    def create_sequences(self, df, lookback=24, forecast_horizon=24):
        sequence_features = [f for f in self.numerical_features if f in df.columns]
        X, y = [], []
        for i in range(len(df) - lookback - forecast_horizon + 1):
            X.append(df[sequence_features].iloc[i:(i + lookback)].values)
            y.append(df['temp_c'].iloc[(i + lookback):(i + lookback + forecast_horizon)].values)
        return np.array(X), np.array(y)


def main():
    processor = DataProcessor()

    print("Loading weather data...")
    weather_json_data = processor.load_json_files("data", "weather")

    print("Loading disaster data...")
    disaster_json_data = processor.load_json_files("data", "disaster")

    print("Extracting weather features...")
    weather_df = processor.extract_weather_features(weather_json_data)

    print("Extracting disaster features...")
    disaster_df = processor.extract_disaster_features(disaster_json_data)

    print("Handling missing values...")
    weather_df = processor.handle_missing_values(weather_df)

    print("Removing outliers...")
    weather_df = processor.remove_outliers(weather_df)

    print("Creating sequences for weather data...")
    X, y = processor.create_sequences(weather_df)

    print("Saving processed data...")
    np.save('data/processed_X.npy', X)
    np.save('data/processed_y.npy', y)
    weather_df.to_csv('data/processed_weather_data.csv')
    disaster_df.to_csv('data/processed_disaster_data.csv')

    print(f"Processed weather data saved: X shape {X.shape}, y shape {y.shape}")
    print("Processed disaster data saved to CSV")


if __name__ == "__main__":
    main()
