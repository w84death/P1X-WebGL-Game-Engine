    FROM python:3
RUN pip install --upgrade pip && \
    pip install SimpleWebSocketServer
WORKDIR /usr/src/app
COPY . .
CMD ["server.py"]
ENTRYPOINT ["python3"]