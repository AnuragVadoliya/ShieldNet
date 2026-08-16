FROM python:3.11-slim

RUN groupadd -r shieldnet && useradd -r -g shieldnet -d /app shieldnet

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R shieldnet:shieldnet /app
USER shieldnet

EXPOSE 8080

CMD ["uvicorn", "soc_api.main:app", "--host", "0.0.0.0", "--port", "8080"]
