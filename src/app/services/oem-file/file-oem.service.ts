import { Injectable } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import * as SecureLS from 'secure-ls';
import { downloadEndpoint } from '../dashboard-service/dashboard.service';
declare let cordova: any;
declare let window: any;
const ls = new SecureLS( { encodingType: 'aes' } );

@Injectable( {
	providedIn: 'root',
} )
export class FileOemService {
	constructor(
		private fileOpener: FileOpener,
		private file: File,
		private platform: Platform
	) { }

	openSecureFile( fileName: string ) {
		var oReq = new XMLHttpRequest();
		const token = ls.get( 'token' );
		oReq.open( 'GET', downloadEndpoint + fileName, true );
		oReq.setRequestHeader( 'Authorization', `Bearer ${token}` );
		oReq.responseType = 'blob';
		oReq.onload = ( oEvent ) => {
			var blob = oReq.response; // Note: not oReq.responseText
			if ( blob ) this.saveFile( fileName, blob );
		};
		oReq.send( null );
	}

	saveFile = ( fileName, fileData ) => {
		let path = this.file.dataDirectory;
		if ( this.platform.is( 'ios' ) ) {
			path = this.file.documentsDirectory;
		}
		window.resolveLocalFileSystemURL( path, ( dir: any ) => {
			dir.getFile(
				fileName,
				{ create: true, exclusive: false },
				( fileEntry ) => {
					fileEntry.createWriter( ( writer ) => {
						writer.onwrite = ( evt ) => {
							this.openPdf( fileEntry.toURL() );
						};

						writer.write( fileData );
					} );
				},
				() => {
					console.log( 'ERROR SAVEFILE' );
				}
			);
		} );
	};

	openPdf = ( url: string ) => {
		this.fileOpener
			.open( url, 'application/pdf' )
			.then( () => { } )
			.catch( ( e ) => { } );
	};
}
