<?php declare(strict_types=1);

namespace Project365;

use GuzzleHttp\Client;
use RuntimeException;

class PageCreator
{
    protected $flickrApiKey;

    public function __construct(string $flickrApiKey)
    {
        $this->flickrApiKey = $flickrApiKey;
    }

    public function update(
        string $year,
        string $flickrUserId,
        string $templateDir
    ) : string {
        $photos = $this->fetchPhotosForYear($year, $flickrUserId);
        return $this->createYearPage($year, $photos, $templateDir);
    }

    /**
     * Collect all photos in reverse date-taken order from Flickr that have the requested year tag.
     */
    protected function fetchPhotosForYear(string $year, string $flickrUserId) : array
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
            'tags' => $year,
        ];

        $url = '?' . http_build_query($urlParamers);

        $client = new Client(['base_uri' => 'https://api.flickr.com/services/rest']);
        $response = $client->get($url);
        $data = json_decode((string)$response->getBody(), true);
        return $data['photos'];
    }

    /**
     * Create an HTML page with all the photos from that year.
     */
    protected function createYearPage(string $year, array $photos, string $templateDir) : string
    {
        $template = "$templateDir/list.phtml";
        $html = $this->renderTemplate($template, [
            'year' => $year,
            'photos' => $photos,
        ]);

        return $html;
    }

    /**
     * Render template in its own context
     */
    protected function renderTemplate(string $template, array $vars) : string
    {
        extract($vars, EXTR_SKIP);

        try {
            ob_start();
            include $template;
            return ob_get_clean();
        } catch (Throwable $e) {
            ob_end_clean();
            throw $e;
        }
    }
}
