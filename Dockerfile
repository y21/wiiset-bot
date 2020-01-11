FROM ubuntu:18.04

RUN apt-get update \
        && apt-get install -y curl \
        && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
        && apt-get install -y nodejs git vim \
        && cd /home \
        && git clone https://github.com/y21/wiiset-bot -b rewrite