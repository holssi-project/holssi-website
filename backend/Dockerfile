FROM rust:1.67-alpine3.17 as builder

RUN apk add --no-cache musl-dev

RUN cargo new --bin app
WORKDIR /app
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build --release && rm src/*.rs ./target/release/deps/holssi_backend*

COPY . .
RUN cargo build --release

FROM alpine:3.17 as runner

COPY --from=builder /app/target/release/holssi-backend /usr/local/bin/

EXPOSE 9000
ENTRYPOINT ["holssi-backend"]