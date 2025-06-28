package main

import (
	"embed"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	bytes, err := os.ReadFile("VERSION")
	var version string = ""
	if err == nil {
		version = string(bytes)
	}

	// Create application with options
	err = wails.Run(&options.App{
		Title:         "Charon",
		DisableResize: true,
		Width:         800,
		Height:        600,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		DragAndDrop: &options.DragAndDrop{
			EnableFileDrop: true,
		},
		Mac: &mac.Options{

			About: &mac.AboutInfo{
				Title:   fmt.Sprintf("Charon %s", version),
				Message: "© 2025 Ondřej Tuček",
			},
		},
		OnStartup: app.startup,
		Bind: []any{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
