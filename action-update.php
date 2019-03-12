<?php declare(strict_types=1);

use Project365\PageCreator;
use Project365\Uploader;

require __DIR__.'/vendor/autoload.php';

lambda(function (array $event) {
    $year = $eventData['year'] ?? date('Y');
    error_log('Creating photo page for ' . $year . '...');

    $flickrApiKey = getenv('FLICKR_API_KEY');
    $flickrUserId = getenv('FLICKR_USER_ID');
    $bucketName = getenv('BUCKET_NAME');
    $cloudFrontId = getenv('CLOUDFRONT_ID');

    // Fetch images from Flicker, create HTML page for year & upload to S3
    $templateDir = realpath('templates');
    $creator = new PageCreator($flickrApiKey);
    $html = $creator->update($year, $flickrUserId, $templateDir);
    if ($html) {
        error_log('Uploading ' . $year . '.html to S3');
        $filename = $year . '.html';
        $uploader = new Uploader($cloudFrontId);
        $uploader->uploadOne($filename, $html, $bucketName);
    }

    return 'Created ' . $year . '.html and uploaded to S3';


    error_log("Uploading assests...");
    var_dump($event);
    var_dump(getenv('FLICKR_API_KEY'));
    var_dump(getenv('FLICKR_USER'));

    return 'Hello ' . ($event['name'] ?? 'world') . '!';
});
