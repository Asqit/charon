package main

import (
	"bytes"
	"charon/utils"
	"context"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"

	goRuntime "runtime"

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

func (a *App) ConvertFiles(destination string, files []utils.ToConvert) (bool, error) {
	ffmpegPath := utils.GetffmpegPath()
	chunkSize := goRuntime.NumCPU()

	var wg sync.WaitGroup
	var mu sync.Mutex
	var success = true

	for i := 0; i < len(files); i += chunkSize {
		end := i + chunkSize
		if end > len(files) {
			end = len(files)
		}

		selected := files[i:end]
		for _, file := range selected {
			wg.Add(1)
			go func(file utils.ToConvert) {
				defer wg.Done()

				filename := strings.Split(filepath.Base(file.Path), ".")[0]
				outputFile := filepath.Join(destination, fmt.Sprintf("converted_%s.%s", filename, file.Format))
				cmd := exec.Command(ffmpegPath, "-y", "-i", file.Path, outputFile)

				var stdoutBuf, stderrBuf bytes.Buffer
				cmd.Stdout = &stdoutBuf
				cmd.Stderr = &stderrBuf

				err := cmd.Run()
				mu.Lock()
				defer mu.Unlock()
				if err != nil {
					success = false
					fmt.Printf("Error converting file %s: %s\n", file.Path, stderrBuf.String())
				}
			}(file)
		}
	}

	wg.Wait()

	return success, nil
}

func (a *App) GetFileType(path string) (*utils.FileDetails, error) {
	details, err := utils.GetFileDetails(path)
	if err != nil {
		return nil, err
	}

	fmt.Println(details)
	return details, nil
}

func (a *App) ClickToSelectFiles() ([]string, error) {
	return runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Files",
	})
}
