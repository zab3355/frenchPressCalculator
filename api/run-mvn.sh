#!/usr/bin/env bash
# Runs Maven inside a container, since this environment has no local JDK/Maven.
# Docker socket is mounted so Testcontainers (used by the API's integration
# tests) can start sibling containers on the host Docker daemon.
set -euo pipefail

mkdir -p "$HOME/.m2"

docker run --rm \
  -v "$(pwd)":/workspace \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$HOME/.m2":/root/.m2 \
  -w /workspace \
  maven:3.9-eclipse-temurin-21 \
  mvn "$@"
