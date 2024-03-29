<?php

declare(strict_types=1);

use Project365\Uploader;

require __DIR__.'/vendor/autoload.php';

return function ($event) {
    error_log("Uploading assets...");

    $bucketName = getenv('BUCKET_NAME');

    $uploader = new Uploader();
    $uploader->uploadFilesFromDirectory('assets', $bucketName);

    error_log("Done. Assets uploaded.");
    return 'Uploaded all files in the public directory to S3 (' . $bucketName . ')';
};
