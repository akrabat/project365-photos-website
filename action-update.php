<?php declare(strict_types=1);

use Project365\PageCreator;
use Project365\Uploader;

require __DIR__.'/vendor/autoload.php';

lambda(function (array $event) {
    $year = $event['year'] ?? date('Y');
    error_log('Creating photo page for ' . $year . '...');

    $flickrApiKey = getenv('FLICKR_API_KEY');
    $flickrUserId = getenv('FLICKR_USER_ID');
    $bucketName = getenv('BUCKET_NAME');
    $cloudFrontId = getenv('CLOUDFRONT_ID');

    // Fetch images from Flicker, create HTML page for year & upload to S3
    $templateDir = realpath('templates');
    $creator = new PageCreator($flickrApiKey);
    try {
        $html = $creator->update($year, $flickrUserId, $templateDir);
        if ($html) {
            error_log('Uploading ' . $year . '.html to S3');
            $filename = $year . '.html';
            $uploader = new Uploader($cloudFrontId);
            $uploader->uploadOne($filename, $html, $bucketName);
        }

        return ['result' => 'Created ' . $year . '.html and uploaded to S3'];
    } catch (Exception $e) {
        error_log('Failed: ' . $e->getMessage());
        return ['result' => 'Failed: ' . $e->getMessage()];
    }
});
