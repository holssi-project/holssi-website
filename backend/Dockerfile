FROM rust:1.80-alpine3.19 as builder

RUN apk add --no-cache musl-dev

RUN cargo new --bin app
WORKDIR /app
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build --release && rm src/*.rs ./target/release/deps/holssi_backend*

COPY . .
RUN cargo build --release

FROM alpine:3.19 as runner

COPY --from=builder /app/target/release/holssi-backend /usr/local/bin/

EXPOSE 9000
ENTRYPOINT ["holssi-backend"]