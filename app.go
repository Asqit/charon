package main

import (
	"bytes"
	"charon/utils"
	"context"
	"fmt"
	"os/exec"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) AskForSaveLocation() (string, error) {
	folder, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Choose where to save your converted files",
	})

	if err != nil {
		return "", err
	}

	return folder, nil
}

// TODO: Handle the conversion with goroutines instead
// Or check FFMPEG if it can't do bulk conversion
func (a *App) ConvertFiles(destination string, files []utils.ToConvert) (bool, error) {
	ffmpegPath := utils.GetffmpegPath()

	for _, file := range files {
		outputFile := filepath.Join(destination, fmt.Sprintf("converted_%s.%s", filepath.Base(file.Path), file.Format))
		cmd := exec.Command(ffmpegPath, "-y", "-i", file.Path, outputFile) // `-y` to overwrite

		var stdoutBuf, stderrBuf bytes.Buffer
		cmd.Stdout = &stdoutBuf
		cmd.Stderr = &stderrBuf

		err := cmd.Run()

		if err != nil {
			return true, fmt.Errorf("ffmpeg failed for file %s: %v\n%s", file.Path, err, stderrBuf.String())
		}
	}

	return false, nil
}

func (a *App) GetFileType(path string) (*utils.FileDetails, error) {
	details, err := utils.GetFileDetails(path)
	if err != nil {
		return nil, err
	}

	return details, nil
}
