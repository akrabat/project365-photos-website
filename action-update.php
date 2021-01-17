<?php declare(strict_types=1);

use Project365\PageCreator;
use Project365\PhotoFetcher;
use Project365\Uploader;

require __DIR__.'/vendor/autoload.php';

lambda(function (array $event) {
    $year = $event['year'] ?? date('Y');
    error_log('Creating photo page for ' . $year . '...');

    $flickrUserId = getenv('FLICKR_USER_ID');
    $bucketName = getenv('BUCKET_NAME');
    $cloudFrontId = getenv('CLOUDFRONT_ID');

    // Fetch images from Flicker, create HTML page for year & upload to S3
    $templateDir = realpath('templates');
    try {
        $photos = (new PhotoFetcher())->fetchPhotosForYear($year, $flickrUserId);
        $html = (new PageCreator())->createYearPage($year, $photos, $templateDir);
        if ($html) {
            $filename = $year . '.html';
            error_log('Uploading ' . $filename . ' to S3');
            $uploader = new Uploader($cloudFrontId);
            $uploader->uploadOne($filename, $html, $bucketName);
        }

        return ['result' => 'Created ' . $year . '.html and uploaded to S3'];
    } catch (Exception $e) {
        error_log('Failed: ' . $e->getMessage());
        return ['result' => 'Failed: ' . $e->getMessage()];
    }
});
