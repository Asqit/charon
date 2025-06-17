package utils

type ToConvert struct {
	Path   string `json:"path"`
	Format string `json:"format"`
}

type FileDetails struct {
	MIMEType      string   `json:"mimeType"`
	Category      string   `json:"category"`
	OutputFormats []string `json:"outputFormats"`
}
