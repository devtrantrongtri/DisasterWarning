import requests
import json
import threading
from datetime import datetime, timedelta
import time
import os

class WeatherDataCollector:
    def __init__(self, weather_api_key, disaster_api_url):
        self.weather_api_key = weather_api_key
        self.weather_base_url = "http://api.weatherapi.com/v1"
        self.disaster_api_url = disaster_api_url
        
    def collect_historical_data(self, location_name, start_date, end_date):
        """Thu thập dữ liệu lịch sử thời tiết bằng tên địa điểm"""
        data = []
        current_date = start_date
        
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            url = f"{self.weather_base_url}/history.json?key={self.weather_api_key}&q={location_name}&dt={date_str}"
            
            try:
                response = requests.get(url)
                response.raise_for_status()
                weather_data = response.json()
                data.append(weather_data)
                
                print(f"Collected data for {location_name} on {date_str}")
                
                # Tạo thư mục nếu chưa tồn tại
                directory = "data"
                if not os.path.exists(directory):
                    os.makedirs(directory)
                
                filename = f"{directory}/weather_{location_name.replace(' ', '_')}_{date_str}.json"
                with open(filename, 'w') as f:
                    json.dump(weather_data, f)
                
                current_date += timedelta(days=1)
                time.sleep(1)
                
            except requests.exceptions.RequestException as e:
                print(f"Error collecting data for {location_name} on {date_str}: {str(e)}")
                current_date += timedelta(days=1)
        
        return data

    def collect_disaster_history(self, country="Vietnam", limit=50, offset=0):
        """Thu thập dữ liệu lịch sử thiên tai từ API ReliefWeb"""
        try:
            url = f"{self.disaster_api_url}?query[value]={country}&limit={limit}&offset={offset}"
            response = requests.get(url)
            response.raise_for_status()
            disaster_data = response.json()
            return disaster_data
        
        except requests.exceptions.RequestException as e:
            print(f"Error collecting disaster history: {str(e)}")
            return None

    def collect_data_for_province(self, province, start_date, end_date):
        name = province
        
        # Thu thập dữ liệu thời tiết
        data = self.collect_historical_data(name, start_date, end_date)
        print(f"Collected weather data for {name}: {len(data)} days")
        
        # Thu thập dữ liệu thiên tai từ ReliefWeb
        disaster_data = self.collect_disaster_history(country=name, limit=50, offset=0)
        if disaster_data:
            print(f"Collected disaster history for {name}: {len(disaster_data['data'])} reports found.")
            
            # Lưu dữ liệu thiên tai vào file
            directory = "data"
            if not os.path.exists(directory):
                os.makedirs(directory)
            
            filename = f"{directory}/disaster_{name.replace(' ', '_')}.json"
            with open(filename, 'w') as f:
                json.dump(disaster_data, f)
        else:
            print(f"No disaster history data found for {name}")


def main():
    weather_api_key = "3e1141883f7b46f9986103021241011"  # Replace with your actual API key
    disaster_api_url = "https://api.reliefweb.int/v1/reports"
    collector = WeatherDataCollector(weather_api_key, disaster_api_url)
    
    provinces = [
        "Ha Noi", "Ho Chi Minh", "Da Nang", "Hai Phong", "Can Tho", 
        "An Giang", "Ba Ria - Vung Tau", "Bac Giang", "Bac Kan", "Bac Lieu", 
        "Bac Ninh", "Ben Tre", "Binh Dinh", "Binh Duong", "Binh Phuoc", 
        "Binh Thuan", "Ca Mau", "Cao Bang", "Dak Lak", "Dak Nong", 
        "Dien Bien", "Dong Nai", "Dong Thap", "Gia Lai", "Ha Giang", 
        "Ha Nam", "Ha Tinh", "Hai Duong", "Hau Giang", "Hoa Binh", 
        "Hung Yen", "Khanh Hoa", "Kien Giang", "Kon Tum", "Lai Chau", 
        "Lam Dong", "Lang Son", "Lao Cai", "Long An", "Nam Dinh", 
        "Nghe An", "Ninh Binh", "Ninh Thuan", "Phu Tho", "Phu Yen", 
        "Quang Binh", "Quang Nam", "Quang Ngai", "Quang Ninh", "Quang Tri", 
        "Soc Trang", "Son La", "Tay Ninh", "Thai Binh", "Thai Nguyen", 
        "Thanh Hoa", "Thua Thien Hue", "Tien Giang", "Tra Vinh", 
        "Tuyen Quang", "Vinh Long", "Vinh Phuc", "Yen Bai"
    ]
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    
    threads = []
    for province in provinces:
        thread = threading.Thread(target=collector.collect_data_for_province, args=(province, start_date, end_date))
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()

if __name__ == "__main__":
    main()
