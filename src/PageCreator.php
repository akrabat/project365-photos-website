<?php declare(strict_types=1);

namespace Project365;

class PageCreator
{
    /**
     * Create an HTML page with all the photos from that year.
     */
    public function createYearPage(string $year, array $photos, string $templateDir) : string
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
