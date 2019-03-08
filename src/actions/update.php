<?php declare(strict_types=1);

use Project365\PhotoPageCreator;
use Project365\Uploader;

include_once 'vendor/autoload.php';

/**
 * update action
 *
 * Note that this file is moved to the project root by sls
 *
 * @throws RuntimeException
 */
function main(array $eventData) : array
{
    if (isset($eventData['env'])) {
        $response['env'] = getenv();
        $response['eventData'] = $eventData;
        return $response;
    }

    $flickrApiKey = getEnvVar('P365_FLICKR_API_KEY');
    $flickrUserId = getEnvVar('P365_FLICKR_USER_ID');
    $s3BucketName = getEnvVar('P365_BUCKET_NAME');
    $cloudFrontId = getEnvVar('P365_CLOUDFRONT_ID');

    if (isset($eventData['upload_assets'])) {
        // upload all assets from the public directory to the S3 bucket
        echo "Uploading assets to S3\n";
        $uploader = new Uploader($cloudFrontId);
        $uploader->uploadAll('public', $s3BucketName);
        return ['result' => 'Uploaded all files in the public directory to S3'];
    }

    // Fetch images from Flicker, create HTML page for year & upload to S3
    $year = $eventData['year'] ?? date('Y');
    echo "Creating photo page for $year\n";
    $templateDir = realpath('templates');
    $creator = new PhotoPageCreator($flickrApiKey);
    $html = $creator->update($year, $flickrUserId, $templateDir, $outputDir);
    if ($html) {
        echo "Uploading $year.html to S3\n";
        $filename = "$year.html";
        $uploader = new Uploader($cloudFrontId);
        $uploader->uploadOne($filename, $html, $s3BucketName);
        $uploader->invalidate(['/'.$filename]);
    }

    return ['result' => "Created $year.html and uploaded to S3"];
}

function getEnvVar(string $key, string $default = '') : string
{
    $value = getenv($key) ?? $default;
    if (empty($value)) {
        throw new RuntimeException("Need to set $key");
    }
    return $value;
}
