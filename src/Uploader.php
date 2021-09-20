<?php declare(strict_types=1);

namespace Project365;

use Aws\CloudFront\CloudFrontClient;
use Aws\S3\S3Client;
use RuntimeException;

final class Uploader
{
    private string $distributionId;
    private S3Client $s3;
    private CloudFrontClient $cft;

    public function __construct(string $distributionId = null, S3Client $s3 = null, CloudFrontClient $cft = null)
    {
        if ($distributionId === null) {
            $distributionId = (string)getenv('CLOUDFRONT_ID');
        }

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
     */
    public function upload(string $year, string $dir, string $bucket): void
    {
        $filename = "$year.html";
        $data = file_get_contents("$dir/$filename");
        $this->uploadOne($filename, $data, $bucket);
        $this->invalidateCache('/'.$filename);
    }

    /**
     * Send All files to S3
     */
    public function uploadFilesFromDirectory(string $dir, string $bucket) : void
    {
        $filenames = [];
        $d = dir($dir);
        while (false !== ($filename = $d->read())) {
            if ($filename[0] === '.') {
                continue;
            }
            $data = file_get_contents("$dir/$filename");
            $this->sendToS3($filename, $data, $bucket);
            $filenames[] = "$filename";
        }
        $d->close();
        $this->invalidateCache($filenames);
    }

    /**
     * Send a file to S3
     *
     * See: https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/guide_commands.html
     */
    public function uploadOne(string $filename, string $data, string $bucket) : string
    {
        $this->sendToS3($filename, $data, $bucket);
        return $bucket;
    }

    /**
     * Send a file to S3
     *
     * See: https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/guide_commands.html
     */
    private function sendToS3(string $filename, string $data, string $bucket) : void
    {
        $contentType = $this->detectContentType($filename);
        $this->s3->putObject([
            'Bucket' => $bucket,
            'ACL' => 'public-read',
            'Key' => $filename,
            'Body' => $data,
            'ContentType' => $contentType,
        ]);

        error_log("Uploaded $filename ($contentType) to S3");
    }

    private function detectContentType(string $filename) : string
    {
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        return match ($ext) {
            'css' => 'text/css',
            'html' => 'text/html',
            default => mime_content_type($filename),
        };
    }

    public function invalidateCache(string|array $filenames) : void
    {
        if (is_string($filenames)) {
            $filenames = [$filenames];
        }

        if (empty($filenames)) {
            return;
        }

        $filenames = array_map(static fn ($f) => '/'.$f, $filenames);

        error_log("Filenames to invalidate: " . print_r($filenames, true));

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
