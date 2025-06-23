FFMPEG_SRC=internal/bin/macos/
FFMPEG_DST=build/bin/charon.app/Contents/Resources/
APP_NAME=charon
UNAME := $(shell uname -m)

.PHONY: build clean

build:
	@echo "📦 Building $(APP_NAME) using Wails..."

	@if [ "$(UNAME)" = "x86_64" ]; then \
		ffmpeg_bin="ffmpeg"; \
	else \
		ffmpeg_bin="ffmpeg-arm64"; \
	fi; \
	wails build; \
	echo "📁 Copying FFmpeg binary into app bundle..."; \
	cp "$(FFMPEG_SRC)$$ffmpeg_bin" "$(FFMPEG_DST)$$ffmpeg_bin"; \
	echo "✅ Build complete with FFmpeg included!"

clean:
	@echo "🧽 Cleaning build directory..."
	rm -rf build/bin
