# Download the conversation_model.ts
wget --load-cookies ~/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies ~/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=1jo4JT5E21U-1f10tgy1dfW6S8n9I3pDs' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=1jo4JT5E21U-1f10tgy1dfW6S8n9I3pDs" -O src/app/util/classifier/conversation_model.pt && rm -rf ~/cookies.txt

mkdir uploads uploads/originals uploads/results