<?php declare(strict_types=1);

namespace Project365;

use Aws\CloudFront\CloudFrontClient;
use Aws\S3\S3Client;
use GuzzleHttp\Client;
use RuntimeException;

class Uploader
{
    protected $distributionId;
    protected $s3;
    protected $cft;

    public function __construct(string $distributionId, Client $s3 = null, CloudFrontClient $cft = null)
    {
        $this->distributionId = $distributionId;
        if (!$s3) {
            $s3 = new S3Client([
                'version' => 'latest',
                'region'  => getenv('AWS_DEFAULT_REGION')
            ]);
        }
        $this->s3 = $s3;

        if (!$cft) {
            $cft = new CloudFrontClient([
                'version' => 'latest',
                'region'  => getenv('AWS_DEFAULT_REGION')
            ]);
        }
        $this->cft = $cft;
    }

    /**
     * Upload a single Year File
     * @param  string $year [description]
     * @param  string $dir  [description]
     * @return [type]       [description]
     */
    public function upload(string $year, string $dir, string $bucket)
    {
        $filename = "$year.html";
        $data = file_get_contents("$dir/$filename");
        $this->uploadOne($filename, $data, $bucket);
        $this->invalidate([$filename]);
    }

    /**
     * Send All files to S3
     */
    public function uploadAll(string $dir, string $bucket) : void
    {
        $filenames = [];
        $d = dir($dir);
        while (false !== ($filename = $d->read())) {
            if ($filename[0] == '.') {
                continue;
            }
            $data = file_get_contents("$dir/$filename");
            $this->uploadOne($filename, $data, $bucket);
            $filenames[] = "/$filename";
        }
        $d->close();
        $this->invalidate($filenames);
    }

    /**
     * Send a file to S3
     *
     * See: https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/guide_commands.html
     */
    public function uploadOne(string $filename, string $data, string $bucket) : bool
    {
        $contentType = $this->detectContentType($filename);
        $result = $this->s3->putObject([
            'Bucket' => $bucket,
            'ACL' => 'public-read',
            'Key' => $filename,
            'Body' => $data,
            'ContentType' => $contentType,
        ]);

        error_log("Uploaded $filename ($contentType) to S3\n");
        return true;
    }

    protected function detectContentType(string $filename) : string
    {
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        switch ($ext) {
            case 'css':
                return 'text/css';
            case 'html':
                return 'text/html';
            default:
                return mime_content_type($filename);
        }
    }

    public function invalidate(array $filenames)
    {
        if (empty($filenames)) {
            return;
        }

        $ref = date('YmdHis');
        $result = $this->cft->createInvalidation([
            'DistributionId' => $this->distributionId,
            'InvalidationBatch' => [
                'CallerReference' => $ref,
                'Paths' => [
                    'Items' => $filenames,
                    'Quantity' => count($filenames),
                ],
            ],
        ]);

        if (!$result) {
            throw new RuntimeException('Failed to invalidate CloudFront');
        }

        error_log("Invalidated CloudFront\n");
    }
}
