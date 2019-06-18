FROM python:2.7

ENV RD_VERSION="11.1.0" RD_BUILD="91033" PHP_HOST="0.0.0.0" PHP_PORT="9000" DEV_HOST="0.0.0.0" DEV_PORT="9001"


RUN cd /opt \
    && wget -O pythonremotedebugging.tar.gz http://downloads.activestate.com/Komodo/releases/$RD_VERSION/remotedebugging/Komodo-PythonRemoteDebugging-$RD_VERSION-$RD_BUILD-linux-x86_64.tar.gz \
    && mkdir -p /opt/pythonremotedebugging \
    && tar -xzC /opt/pythonremotedebugging --strip-components=1 -f pythonremotedebugging.tar.gz \
    && rm /opt/pythonremotedebugging.tar.gz

RUN ppath=$(python -c "import sys; print('\n'.join(sys.path))" | grep "site-packages") \
    && ln -s /opt/pythonremotedebugging/pythonlib/* $ppath/

CMD /opt/pythonremotedebugging/pydbgpproxy -d ${PHP_HOST}:${PHP_PORT} -i ${DEV_HOST}:${DEV_PORT}
