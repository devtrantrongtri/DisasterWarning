from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Optional
import pandas as pd
import requests
import logging
import asyncio
from datetime import datetime, timedelta
from model_trainer import OptimizedDisasterPredictionModel

# Cấu hình logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG) 

app = FastAPI(
    title="Disaster Prediction API",
    description="API for predicting natural disasters based on weather data",
    version="1.0.0"
)

# Weather API Configuration
API_KEY = "3e1141883f7b46f9986103021241011"
BASE_URL = "https://api.weatherapi.com/v1/forecast.json"
HISTORY_URL = "https://api.weatherapi.com/v1/history.json"

# Load model
try:
    model = OptimizedDisasterPredictionModel.load_model('disaster_prediction_model_v2.joblib')
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

# Schemas
class WeatherData(BaseModel):
    timestamp: str
    temp_c: float
    humidity: float
    wind_kph: float
    pressure_mb: float
    precip_mm: float
    cloud: Optional[float] = None
    feelslike_c: Optional[float] = None
    dewpoint_c: Optional[float] = None
    wind_degree: Optional[float] = None
    gust_kph: Optional[float] = None
    is_day: Optional[int] = None
    condition_text: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "timestamp": "2024-11-20 00:00",
                "temp_c": 23.8,
                "humidity": 67.0,
                "wind_kph": 5.8,
                "pressure_mb": 1018.0,
                "precip_mm": 0.0,
                "cloud": 64.0,
                "feelslike_c": 25.5,
                "dewpoint_c": 17.3,
                "wind_degree": 145.0,
                "gust_kph": 8.9,
                "is_day": 0,
                "condition_text": "Cloudy"
            }
        }

class DisasterDescription(BaseModel):
    disaster: str
    disaster_description: str

class PredictionResponse(BaseModel):
    timestamp: str
    predictions: Dict[str, float]
    risk_levels: Dict[str, str]
    warning_message: Optional[str] = None
    disaster_descriptions: Optional[List[DisasterDescription]] = None

# Helper functions
def get_historical_weather(location: str, start_date: datetime, end_date: datetime) -> List[Dict]:
    historical_data = []
    current_date = start_date
    
    while current_date <= end_date:
        params = {
            "key": API_KEY,
            "q": location,
            "dt": current_date.strftime("%Y-%m-%d")
        }
        try:
            response = requests.get(HISTORY_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            for hour_data in data["forecast"]["forecastday"][0]["hour"]:
                historical_data.append({
                    "timestamp": hour_data["time"],
                    "temp_c": float(hour_data["temp_c"]),
                    "humidity": float(hour_data["humidity"]),
                    "wind_kph": float(hour_data["wind_kph"]),
                    "pressure_mb": float(hour_data["pressure_mb"]),
                    "precip_mm": float(hour_data["precip_mm"]),
                    "cloud": float(hour_data.get("cloud", 0)),
                    "feelslike_c": float(hour_data.get("feelslike_c", 0)),
                    "dewpoint_c": float(hour_data.get("dewpoint_c", 0)),
                    "wind_degree": float(hour_data.get("wind_degree", 0)),
                    "gust_kph": float(hour_data.get("gust_kph", 0)),
                    "is_day": int(hour_data.get("is_day", 0)),
                    "condition_text": str(hour_data["condition"]["text"]).strip()
                })
            
            current_date += timedelta(days=1)
        except Exception as e:
            logger.error(f"Error fetching historical weather data: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to fetch historical weather data: {str(e)}")
    
    return historical_data

def get_weather_forecast(location: str, days: int = 7) -> dict:
    params = {
        "key": API_KEY,
        "q": location,
        "days": days,
        "aqi": "no",
        "alerts": "no"
    }
    try:
        logger.info(f"Fetching weather data for location: {location} for {days} days")
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        logger.info(f"Successfully fetched weather data for {location}")
        return response.json()
    except Exception as e:
        logger.error(f"Error fetching weather data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch weather data from Weather API")

def format_weather_data(api_response: dict) -> List[Dict]:
    try:
        formatted_data = []
        for forecast in api_response["forecast"]["forecastday"]:
            for hour_data in forecast["hour"]:
                formatted_data.append({
                    "timestamp": hour_data["time"],
                    "temp_c": float(hour_data["temp_c"]),
                    "humidity": float(hour_data["humidity"]),
                    "wind_kph": float(hour_data["wind_kph"]),
                    "pressure_mb": float(hour_data["pressure_mb"]),
                    "precip_mm": float(hour_data["precip_mm"]),
                    "cloud": float(hour_data.get("cloud", 0)),
                    "feelslike_c": float(hour_data.get("feelslike_c", 0)),
                    "dewpoint_c": float(hour_data.get("dewpoint_c", 0)),
                    "wind_degree": float(hour_data.get("wind_degree", 0)),
                    "gust_kph": float(hour_data.get("gust_kph", 0)),
                    "is_day": int(hour_data.get("is_day", 0)),
                    "condition_text": str(hour_data["condition"]["text"]).strip()
                })
        return formatted_data
    except Exception as e:
        logger.error(f"Error formatting weather data: {e}")
        raise HTTPException(status_code=500, detail=f"Error formatting weather data: {str(e)}")

def get_risk_level(probability: float) -> str:
    if probability >= 0.75:
        return "Rất cao"
    elif probability >= 0.5:
        return "Cao"
    elif probability >= 0.25:
        return "Trung bình"
    else:
        return "Thấp"

def generate_disaster_description(disaster_type: str, risk_level: str, details: dict) -> str:
    logger.debug(f"Details provided: {details}")
    
    description = f"🌟 **MỨC ĐỘ**: {risk_level.capitalize()}.\n\n"
    disaster_description_generated = False  # Biến kiểm tra xem đã tạo mô tả chưa

    # Xử lý thảm họa lũ lụt
    if disaster_type == "flood":
        precipitation = details.get('precipitation', 0)
        if precipitation < 0:
            raise ValueError("Precipitation cannot be negative")
        
        if precipitation >= 100:
            description += f"🌊 **CẢNH BÁO LŨ LỤT NGHIÊM TRỌNG**: Lượng mưa cực lớn {precipitation:.1f} mm trong 24 giờ. " \
                           f"Nguy cơ lũ quét và sạt lở đất cực kỳ nguy hiểm, đặc biệt ở các khu vực gần suối, sông và vùng núi.\n"
            description += "⚠️ **Khuyến cáo KHẨN CẤP**: Sơ tán ngay lập tức khỏi các khu vực trũng thấp, ven sông, suối, và các khu vực có địa hình dốc.\n"
            description += "💡 **Lưu ý**: Tránh di chuyển qua các cầu yếu, khu vực có nước dâng cao, và chờ đợi sự hướng dẫn của chính quyền.\n"
            disaster_description_generated = True
        elif precipitation >= 50:
            description += f"🌊 **CẢNH BÁO LŨ LỤT**: Lượng mưa lớn {precipitation:.1f} mm trong 24 giờ. Nguy cơ ngập lụt cao tại các khu vực trũng và gần các dòng suối.\n"
            description += "⚠️ **Khuyến cáo**: Sơ tán khỏi các khu vực thấp, tránh đi lại trên đường bị ngập nước, hạn chế di chuyển vào ban đêm.\n"
            description += "💡 **Lưu ý**: Cập nhật tình hình thời tiết thường xuyên qua các kênh thông tin chính thống.\n"
            disaster_description_generated = True
        elif precipitation >= 20:
            description += f"🌊 **CẢNH BÁO MƯA LỚN**: Lượng mưa {precipitation:.1f} mm trong 24 giờ. Nguy cơ ngập úng cục bộ tại các khu vực thấp.\n"
            description += "⚠️ **Khuyến cáo**: Kiểm tra các cống thoát nước, tránh di chuyển khi mưa lớn, đặc biệt trên các tuyến đường dễ bị ngập.\n"
            description += "💡 **Lưu ý**: Chuẩn bị kế hoạch ứng phó với mưa lớn và kiểm tra lại các khu vực dễ bị ngập úng.\n"
            disaster_description_generated = True
        
        if precipitation < 20 and not disaster_description_generated:
            description += f"🌧️ **CẢNH BÁO MƯA NHẸ**: Lượng mưa {precipitation:.1f} mm trong 24 giờ, không có nguy cơ lớn về lũ lụt.\n"
            description += "⚠️ **Khuyến cáo**: Cẩn thận khi di chuyển, đặc biệt là trong các khu vực giao thông dễ bị ngập.\n"
            description += "💡 **Lưu ý**: Theo dõi tiếp thông tin thời tiết trong suốt ngày hôm nay.\n"
            disaster_description_generated = True

    # Xử lý thảm họa bão
    elif disaster_type == "storm":
        wind_speed = details.get('wind_speed', 0) * 3.6  # Chuyển m/s sang km/h
        if wind_speed >= 120:
            description += f"🌪️ **CẢNH BÁO BÃO KHỦNG KHIÊP**: Gió giật cấp {int(wind_speed/10)} với tốc độ {wind_speed:.1f} km/h. Nguy hiểm cực kỳ cao!\n"
            description += "⚠️ **Khuyến cáo KHẨN CẤP**: Sơ tán ngay lập tức khỏi các khu vực ven biển, gần các bãi biển, khu vực có nhiều cây cao và các công trình yếu.\n"
            description += "💡 **Lưu ý**: Tắt các thiết bị điện, đóng cửa chặt và trú ẩn trong các công trình kiên cố. Đảm bảo không có đồ vật nào có thể bay vào nhà.\n"
            disaster_description_generated = True
        elif wind_speed >= 80:
            description += f"🌪️ **CẢNH BÁO BÃO MẠNH**: Gió giật cấp {int(wind_speed/10)} với tốc độ {wind_speed:.1f} km/h. Nguy hiểm rất cao!\n"
            description += "⚠️ **Khuyến cáo**: Gia cố nhà cửa, tránh xa các khu vực có cây cao và tránh di chuyển ngoài trời nếu không cần thiết.\n"
            description += "💡 **Lưu ý**: Đảm bảo cửa sổ và cửa ra vào được đóng kín, chuẩn bị kế hoạch sơ tán nếu cần thiết.\n"
            disaster_description_generated = True
        elif wind_speed >= 40:
            description += f"🌪️ **CẢNH BÁO GIÓ MẠNH**: Gió giật cấp {int(wind_speed/10)} với tốc độ {wind_speed:.1f} km/h.\n"
            description += "⚠️ **Khuyến cáo**: Cẩn thận khi di chuyển, tránh xa cây cối và vật liệu dễ bị cuốn bay.\n"
            description += "💡 **Lưu ý**: Kiểm tra lại mái nhà và các vật dụng ngoài trời để tránh thiệt hại.\n"
            disaster_description_generated = True
        
        if wind_speed < 40 and not disaster_description_generated:
            description += f"🌪️ **CẢNH BÁO GIÓ NHẸ**: Gió mạnh {wind_speed:.1f} km/h, không gây ra nguy hiểm lớn.\n"
            description += "⚠️ **Khuyến cáo**: Hạn chế ra ngoài trong điều kiện gió lớn, kiểm tra lại các vật dụng dễ bay trong khu vực ngoài trời.\n"
            description += "💡 **Lưu ý**: Theo dõi tình hình thời tiết để có thể ứng phó kịp thời với bất kỳ thay đổi nào.\n"
            disaster_description_generated = True

    # Xử lý thảm họa hạn hán
    elif disaster_type == "drought":
        temp = details.get('temperature', 0)
        if temp >= 40:
            description += f"🌞 **CẢNH BÁO HẠN HÁN NGUY HIỂM**: Nhiệt độ cực cao {temp:.1f}°C, nguy cơ cháy rừng và thiếu nước nghiêm trọng!\n"
            description += "⚠️ **Khuyến cáo KHẨN CẤP**: Hạn chế hoạt động ngoài trời, tiết kiệm nước, tránh để lửa không kiểm soát.\n"
            description += "💡 **Lưu ý**: Cập nhật tình hình nguồn nước và tuân thủ các biện pháp tiết kiệm nước trong sinh hoạt.\n"
            disaster_description_generated = True
        elif temp >= 35:
            description += f"🌞 **CẢNH BÁO HẠN HÁN**: Nhiệt độ cao {temp:.1f}°C, nguy cơ thiếu nước và ảnh hưởng đến cây trồng.\n"
            description += "⚠️ **Khuyến cáo**: Quản lý nguồn nước, bảo vệ cây trồng, không sử dụng nước quá mức cho các hoạt động ngoài trời.\n"
            description += "💡 **Lưu ý**: Cần theo dõi tình hình và chuẩn bị cho các biện pháp ứng phó khi mức nước giảm sâu.\n"
            disaster_description_generated = True
        
        if temp < 35 and not disaster_description_generated:
            description += f"🌞 **CẢNH BÁO NÓNG**: Nhiệt độ {temp:.1f}°C có thể ảnh hưởng đến sức khỏe và nông nghiệp.\n"
            description += "⚠️ **Khuyến cáo**: Uống đủ nước, hạn chế hoạt động ngoài trời vào giữa trưa, chuẩn bị phương án giảm nhiệt.\n"
            description += "💡 **Lưu ý**: Đảm bảo nguồn nước dự trữ và giám sát nhiệt độ trong khu vực.\n"
            disaster_description_generated = True

    # Xử lý thảm họa lạnh cực đoan
    elif disaster_type == "cold_wave":
        temp = details.get('temperature', 0)
        if temp <= -10:
            description += f"❄️ **CẢNH BÁO ĐÔNG GIÁNG NGUY HIỂM**: Nhiệt độ cực thấp {temp:.1f}°C! Nguy cơ chết người do giá rét!\n"
            description += "⚠️ **Khuyến cáo KHẨN CẤP**: Ở trong nhà, giữ ấm tuyệt đối, tránh đi ra ngoài nếu không cần thiết.\n"
            description += "💡 **Lưu ý**: Kiểm tra hệ thống sưởi ấm trong nhà, đảm bảo thức ăn và nước uống dự trữ đủ dùng.\n"
            disaster_description_generated = True
        elif temp <= 0:
            description += f"❄️ **CẢNH BÁO ĐÔNG GIÁNG**: Nhiệt độ rất thấp {temp:.1f}°C. Nguy cơ đóng băng cao!\n"
            description += "⚠️ **Khuyến cáo**: Mặc ấm, hạn chế ra ngoài, đặc biệt trong khu vực có băng tuyết.\n"
            description += "💡 **Lưu ý**: Giữ ấm cho vật nuôi, tránh để nước ngoài trời đóng băng.\n"
            disaster_description_generated = True
        
        if temp > 0 and not disaster_description_generated:
            description += f"❄️ **CẢNH BÁO LẠNH**: Nhiệt độ {temp:.1f}°C có thể gây ra một số khó khăn trong sinh hoạt.\n"
            description += "⚠️ **Khuyến cáo**: Mặc ấm, uống nước ấm và giữ gìn sức khỏe.\n"
            description += "💡 **Lưu ý**: Cập nhật tình hình thời tiết thường xuyên và chuẩn bị kế hoạch dự phòng.\n"
            disaster_description_generated = True

    return description

# Routes
@app.post("/predict", response_model=PredictionResponse)
async def predict_disasters(weather_data: WeatherData):
    logger.info(f"Predicting disasters for timestamp: {weather_data.timestamp}")
    
    try:
        # Get historical data for feature engineering
        current_time = pd.to_datetime(weather_data.timestamp)
        start_date = current_time - timedelta(days=14)  # Get 14 days of historical data
        
        # Get historical weather data
        historical_data = get_historical_weather(location="auto:ip", start_date=start_date, end_date=current_time)
        
        # Create DataFrame with historical and current data
        df = pd.DataFrame(historical_data + [weather_data.dict()])
        df = df.sort_values('timestamp')
        
        # Prepare features using the model's method
        features = model.prepare_features(df)
        
        # Get the latest row (current prediction)
        latest_features = features.iloc[-1:]
        
        # Make prediction
        predictions = model.predict(latest_features)
        
        # Convert predictions to dictionary
        prediction_dict = {
            disaster_type: float(pred) 
            for disaster_type, pred in zip(model.disaster_types, predictions[0])
        }
        
        # Calculate risk levels
        risk_levels = {
            disaster_type: get_risk_level(prob) 
            for disaster_type, prob in prediction_dict.items()
        }
        
        # Generate warning message if needed
        high_risk_disasters = [
            disaster_type 
            for disaster_type, prob in prediction_dict.items() 
            if prob >= 0.5
        ]
        
        warning_message = None
        if high_risk_disasters:
            warning_message = f"Cảnh báo: Có nguy cơ cao xảy ra {', '.join(high_risk_disasters)}"
        
        precipitation_24h = df['precip_mm'].tail(24).sum()

        # Sau đó trong disaster_descriptions
        disaster_descriptions = {
            disaster_type: generate_disaster_description(
                disaster_type, 
                risk_levels[disaster_type],
                {
                    "beaufort_scale": 10,
                    "wind_speed": latest_features['wind_kph'].iloc[0] * 0.277778,
                    "precipitation": precipitation_24h,
                    "temperature": latest_features['temp_c'].iloc[0],
                    "magnitude": 7
                }
            )
            for disaster_type in high_risk_disasters
        }
        
        return PredictionResponse(
            timestamp=weather_data.timestamp,
            predictions=prediction_dict,
            risk_levels=risk_levels,
            warning_message=warning_message,
            disaster_descriptions=disaster_descriptions
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/predict/forecast", response_model=List[PredictionResponse])
async def predict_disaster_from_forecast(location: str, days: int = 7):
    try:
        # Get historical data first (14 days back from today)
        current_time = datetime.now()
        start_date = current_time - timedelta(days=14)
        historical_data = get_historical_weather(location=location, start_date=start_date, end_date=current_time)
        
        # Get forecast data
        weather_api_response = get_weather_forecast(location, days)
        forecast_data = format_weather_data(weather_api_response)
        
        # Combine historical and forecast data
        all_data = historical_data + forecast_data
        
        # Convert to DataFrame
        df = pd.DataFrame(all_data)
        df = df.sort_values('timestamp')
        
        # Process each forecast point
        predictions_responses = []
        for idx in range(len(historical_data), len(all_data)):
            try:
                # Get the subset of data up to current forecast point
                current_df = df.iloc[:idx + 1]
                
                # Prepare features
                features = model.prepare_features(current_df)
                
                # Get the latest row (current prediction)
                latest_features = features.iloc[-1:]
                
                # Make prediction
                predictions = model.predict(latest_features)
                
                # Create response
                current_data = all_data[idx]
                prediction_dict = {
                    disaster_type: float(pred)
                    for disaster_type, pred in zip(model.disaster_types, predictions[0])
                }
                
                risk_levels = {
                    disaster_type: get_risk_level(prob)
                    for disaster_type, prob in prediction_dict.items()
                }
                
                high_risk_disasters = [
                    disaster_type
                    for disaster_type, prob in prediction_dict.items()
                    if prob >= 0.5
                ]
                
                warning_message = None
                if high_risk_disasters:
                    warning_message = f"Cảnh báo: Có nguy cơ cao xảy ra {', '.join(high_risk_disasters)}"
                
                precipitation_24h = df['precip_mm'].tail(24).sum()

                # Tạo disaster_descriptions
                disaster_descriptions = [
                    {
                        "disaster": disaster_type,
                        "disaster_description": generate_disaster_description(
                            disaster_type, 
                            risk_levels[disaster_type],
                            {
                                "beaufort_scale": 10,
                                "wind_speed": latest_features['wind_kph'].iloc[0] * 0.277778,
                                "precipitation": precipitation_24h,
                                "temperature": latest_features['temp_c'].iloc[0],
                                "magnitude": 7
                            }
                        )  # Mô tả thảm họa
                    }
                    for disaster_type in high_risk_disasters
                ]
                
                response = PredictionResponse(
                    timestamp=current_data['timestamp'],
                    predictions=prediction_dict,
                    risk_levels=risk_levels,
                    warning_message=warning_message,
                    disaster_descriptions=disaster_descriptions
                )

                
                predictions_responses.append(response)
                
            except Exception as e:
                logger.error(f"Error processing individual forecast: {e}")
                continue
        
        if not predictions_responses:
            raise HTTPException(status_code=500, detail="No valid predictions could be made")
        
        return predictions_responses
        
    except Exception as e:
        logger.error(f"Error processing forecast data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("predictor:app", host="127.0.0.1", port=8000, reload=True)