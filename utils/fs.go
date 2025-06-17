package utils

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// ------------------------------------------ Exported ----

func GetffmpegPath() string {
	exePath, _ := os.Executable()
	exeDir := filepath.Dir(exePath)
	ffmpegPath := filepath.Join(exeDir, "../Resources/ffmpeg") // macOS .app bundle
	ffmpegPath, _ = filepath.Abs(ffmpegPath)

	return ffmpegPath
}

func GetFileDetails(path string) (*FileDetails, error) {
	contents, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("reading file failed: %w", err)
	}
	mimeType := http.DetectContentType(contents)

	category := categorizeMimeType(mimeType)
	if category == "" {
		return nil, fmt.Errorf("unsupported MIME type: %s", mimeType)
	}

	outputFormats, err := getFFmpegOutputFormats(category)
	if err != nil {
		return nil, fmt.Errorf("failed to get output formats: %w", err)
	}

	return &FileDetails{
		MIMEType:      mimeType,
		Category:      category,
		OutputFormats: outputFormats,
	}, nil
}

// ------------------------------------------ Internal ----

func categorizeMimeType(mime string) string {
	switch {
	case strings.HasPrefix(mime, "image/"):
		return "image"
	case strings.HasPrefix(mime, "video/"):
		return "video"
	case strings.HasPrefix(mime, "audio/"):
		return "audio"
	default:
		return ""
	}
}

func getFFmpegOutputFormats(category string) ([]string, error) {
	ffmpegBinary := GetffmpegPath()

	cmd := exec.Command(ffmpegBinary, "-hide_banner", "-encoders")
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("error running ffmpeg: %v\n%s", err, out.String())
	}

	var prefix string
	switch category {
	case "video":
		prefix = "V"
	case "audio":
		prefix = "A"
	case "image":
		// no dedicated image encoders, but some video encoders handle images,
		// so let's treat as video for simplicity or add special logic if needed
		prefix = "V"
	default:
		return nil, fmt.Errorf("unsupported category: %s", category)
	}

	var formats []string
	seen := make(map[string]bool)

	lines := strings.Split(out.String(), "\n")
	for _, line := range lines {

		// Each line looks like: " V..... libx264             H.264 / AVC / MPEG-4 AVC ..."
		if len(line) > 0 && strings.HasPrefix(line, prefix) {
			fields := strings.Fields(line)
			if len(fields) >= 2 {
				encoderName := fields[1]
				if !seen[encoderName] {
					formats = append(formats, encoderName)
					seen[encoderName] = true
				}
			}
		}
	}

	fmt.Println(formats)

	return formats, nil
}
