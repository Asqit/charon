# Makefile for building Charon app with FFmpeg bundling

# Paths
FFMPEG_SRC=internal/bin/ffmpeg
FFMPEG_DST=build/bin/charon.app/Contents/Resources/ffmpeg
APP_NAME=charon

.PHONY: build clean

## 🔨 Build the Wails app and include FFmpeg
build:
	@echo "📦 Building $(APP_NAME) using Wails..."
	wails build

	@echo "📁 Copying ffmpeg binary into app bundle..."
	cp $(FFMPEG_SRC) $(FFMPEG_DST)

	@echo "✅ Build complete with FFmpeg included!"

## 🧹 Clean build artifacts
clean:
	@echo "🧽 Cleaning build directory..."
	rm -rf build/bin
