import pandas as pd
import joblib

try:
    # Load mô hình đã lưu
    model = joblib.load('models/disaster_prediction_model_v1.joblib')

    # Kiểm tra xem 'feature_importance_' có tồn tại trong mô hình không
    if hasattr(model, 'feature_importances_'):
        feature_importances = model.feature_importances_

        # Lấy tên các đặc trưng từ mô hình (giả sử bạn có tên các đặc trưng trong 'selected_features')
        # Nếu bạn không có sẵn danh sách này, bạn có thể phải tự tạo hoặc lấy từ trước
        selected_features = ['temp_c', 'humidity', 'wind_kph', 'pressure_mb', 'precip_mm', 'cloud']  # Thay đổi nếu cần

        # Tạo DataFrame với độ quan trọng của các đặc trưng
        feature_importance_df = pd.DataFrame({
            'Feature': selected_features,
            'Importance': feature_importances
        })

        # Sắp xếp theo độ quan trọng
        feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)

        # Lưu DataFrame vào file CSV
        feature_importance_df.to_csv('feature_importance.csv', index=False)

        # Thông báo
        print("Các đặc trưng và độ quan trọng đã được lưu vào file 'feature_importance.csv'.")
    else:
        print("Mô hình không có thuộc tính 'feature_importances_'.")
        
except Exception as e:
    print(f"Đã xảy ra lỗi: {e}")
