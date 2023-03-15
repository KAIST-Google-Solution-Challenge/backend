FROM python:3.9.15
LABEL creator="Byunk <clearman001@gmail.com>"
LABEL name="The-voice-backend"

SHELL ["/bin/bash", "-c"]

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
      software-properties-common \
      sudo \
      wget \
      build-essential \
      git \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN echo "**** Installing Node ****" && \
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    source ~/.bashrc && \
    nvm install 16.19.0

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg

COPY . /home/the-voice-backend

WORKDIR /home/the-voice-backend

# Install npm dependencies
RUN apt-get install -y npm && \
    npm install

# Install pip dependencies
RUN pip3.9 install -r requirements.txt

# Install conversation_model
RUN wget --load-cookies ~/cookies.txt \ 
    "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies ~/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=1jo4JT5E21U-1f10tgy1dfW6S8n9I3pDs' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=1jo4JT5E21U-1f10tgy1dfW6S8n9I3pDs" -O src/app/util/classifier/conversation_model.pt && rm -rf ~/cookies.txt

# Execute python to cache bert model
RUN python src/app/util/classifier/main.py testtest

# ETC Configuration
RUN mkdir uploads uploads/originals uploads/results

# Register the service account key
ENV GOOGLE_APPLICATION_CREDENTIALS "/home/the-voice-backend/service-account-key.json"

ENTRYPOINT [ "/bin/bash" ]