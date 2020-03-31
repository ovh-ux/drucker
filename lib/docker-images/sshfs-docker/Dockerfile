# credits due to https://github.com/macropin/docker-sshd 

FROM registry.ovh.net/official/alpine:3.4
MAINTAINER Mathieu Larose <mathieu.larose@corp.ovh.com>

EXPOSE 22
EXPOSE 9000

RUN apk --no-cache add bash openssh rsync
RUN mkdir -p ~root/.ssh /etc/authorized_keys && chmod u+rwX,og-wx ~root/.ssh

COPY ./sshd_config /etc/ssh/sshd_config
COPY ./entry.sh /entry.sh
RUN chmod +x /entry.sh

ENTRYPOINT ["/entry.sh"]

CMD ["/usr/sbin/sshd", "-D", "-f", "/etc/ssh/sshd_config"]

