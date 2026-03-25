# Bước 1: Chọn môi trường chạy (Node.js version 20)
FROM node:20-alpine

# Bước 2: Tạo thư mục làm việc trong Container
WORKDIR /app

# Bước 3: Copy file quản lý thư viện vào trước để cache (tối ưu build)
COPY package*.json ./

# Bước 4: Cài đặt các thư viện (chỉ cài production để nhẹ image)
RUN npm install --production

# Bước 5: Copy toàn bộ mã nguồn vào container
COPY . .

# Bước 6: Mở cổng 3000 (trùng với PORT trong code của bạn)
EXPOSE 3000

# Bước 7: Lệnh để khởi chạy ứng dụng
CMD ["node", "server.js"]

####################################### BUILD NEW IMAGE 
#docker login 
#docker build -t your_dockerhub_username/new_image_name:latest .
####################################### PUSH TO DOCKERHUB
#docker push your_dockerhub_username/new_image_name:latest
####################################### RUN IMAGE LOCALLY
#docker run -p 3000:3000 --env-file .env your_dockerhub_username/new_image_name:latest