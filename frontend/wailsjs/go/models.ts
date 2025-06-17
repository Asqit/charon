export namespace utils {
	
	export class FileDetails {
	    mimeType: string;
	    category: string;
	    outputFormats: string[];
	
	    static createFrom(source: any = {}) {
	        return new FileDetails(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mimeType = source["mimeType"];
	        this.category = source["category"];
	        this.outputFormats = source["outputFormats"];
	    }
	}
	export class ToConvert {
	    path: string;
	    format: string;
	
	    static createFrom(source: any = {}) {
	        return new ToConvert(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.format = source["format"];
	    }
	}

}

