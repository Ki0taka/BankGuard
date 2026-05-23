export class UrlHelper {
  /**
   * Transforms various cloud storage URLs into direct download links.
   * Currently supports: Google Drive.
   */
  static transformToDirectDownload(url: string): string {
    if (!url) return url;

    // Google Drive: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // Direct: https://drive.google.com/uc?export=download&id=FILE_ID
    const driveMatch = url.match(
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    );
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }

    // Google Drive raw link: https://drive.google.com/open?id=FILE_ID
    const driveOpenMatch = url.match(
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    );
    if (driveOpenMatch && driveOpenMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${driveOpenMatch[1]}`;
    }

    // Google Sheets: https://docs.google.com/spreadsheets/d/FILE_ID/edit...
    const sheetsMatch = url.match(
      /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
    );
    if (sheetsMatch && sheetsMatch[1]) {
      return `https://docs.google.com/spreadsheets/d/${sheetsMatch[1]}/export?format=xlsx`;
    }

    // Dropbox: https://www.dropbox.com/s/ID/file.xlsx?dl=0
    // Direct: https://www.dropbox.com/s/ID/file.xlsx?dl=1
    if (url.includes('dropbox.com')) {
      return url.replace('dl=0', 'dl=1');
    }

    // OneDrive: https://1drv.ms/x/s!ID
    // OneDrive typically requires a more complex transformation or specific sharing link tweaks.
    // Standard sharing link to download: replace ?... with ?download=1
    if (url.includes('onedrive.live.com') || url.includes('1drv.ms')) {
      if (url.includes('?')) {
        return url.split('?')[0] + '?download=1';
      }
      return url + '?download=1';
    }

    return url;
  }
}
