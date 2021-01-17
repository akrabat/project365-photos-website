<?php declare(strict_types=1);

namespace Project365;

use GuzzleHttp\Client;
use RuntimeException;

class PhotoFetcher
{
    protected $flickrApiKey;

    public function __construct(string $flickrApiKey = null)
    {
        $this->flickrApiKey = $flickrApiKey ?? (string)getenv('FLICKR_API_KEY');
    }

    /**
     * Collect all photos in reverse date-taken order from Flickr that have the requested year tag.
     */
    public function fetchPhotosForYear(string $year, string $flickrUserId) : array
    {
        $urlParamers = [
            'api_key' => $this->flickrApiKey,
            'user_id' => $flickrUserId,
            'format' => 'json',
            'nojsoncallback' => 1,
            'extras' => 'url_z, date_taken, owner_name', // 640px images, date photo taken
            'method' => 'flickr.photos.search',
            'per_page' => '366',
            'sort' => 'date-taken-desc',
            'tags' => '365:' . $year,
        ];

        $url = '?' . http_build_query($urlParamers);

        $client = new Client(['base_uri' => 'https://api.flickr.com/services/rest']);
        $response = $client->get($url);
        $data = json_decode((string)$response->getBody(), true);

        if (!is_array($data)) {
            error_log('Unexpected response from API.');
            error_log('API response: ' . $response->getStatusCode());
            error_log('API body: ' . (string)$response->getBody());
            throw new RuntimeException('Unexpected response from API.');
        }

        // sort
        $photos = [];
        foreach ($data['photos']['photo'] as $photo) {
            $date = date('Ymd', strtotime($photo['datetaken']));
            $photos[$date] = $photo;
        }
        if (empty($photos)) {
            error_log('No photos returned.');
            error_log('API response: ' . $response->getStatusCode());
            error_log('API body: ' . (string)$response->getBody());
            throw new RuntimeException('No photos returned');
        }
        krsort($photos);

        error_log('Found ' . count($photos) . ' photos.');

        $data['photos']['photo'] = $photos;

        return $data['photos'];
    }
}
