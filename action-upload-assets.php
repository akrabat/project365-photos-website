<?php declare(strict_types=1);

use Project365\Uploader;

require __DIR__.'/vendor/autoload.php';

lambda(function (array $event) {
    error_log("Uploading assets...");
    $cloudFrontId = getenv('CLOUDFRONT_ID');
    $bucketName = getenv('BUCKET_NAME');
    $uploader = new Uploader($cloudFrontId);
    $uploader->uploadFilesFromDirectory('assets', $bucketName);
    error_log("Done. Assets uploaded.");
    return ['result' => 'Uploaded all files in the public directory to S3'];
});
