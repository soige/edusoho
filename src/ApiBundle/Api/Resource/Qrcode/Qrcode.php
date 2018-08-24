<?php

namespace ApiBundle\Api\Resource\Qrcode;

use ApiBundle\Api\ApiRequest;
use ApiBundle\Api\Resource\AbstractResource;

class Qrcode extends AbstractResource
{
    public function get(ApiRequest $request, $route)
    {
        $params = $this->fillParams($request->query->all());
        $user = $this->getCurrentUser();
        $url = $this->generateUrl($route, $params, true);
        $token = $this->getTokenService()->makeToken(
            'qrcode',
            array(
                'userId' => $user['id'],
                'data' => array(
                    'url' => $url,
                ),
                'times' => 1,
                'duration' => 3600,
            )
        );
        $url = $this->generateUrl('common_parse_qrcode', array('token' => $token['token']), true);

        return array(
            'img' => $this->generateUrl('common_qrcode', array('text' => $url), true),
            'token' => $token['token'],
        );
    }

    public function fillParams($params)
    {
        if (empty($params['times']) && empty($params['duration'])) {
            return $params;
        }
        $user = $this->getCurrentUser();
        $token = $this->getTokenService()->makeToken(
            'qrcode_url',
            array(
                'userId' => $user['id'],
                'data' => array(),
                'times' => empty($params['times']) ? 0 : $params['times'],
                'duration' => empty($params['duration']) ? 0 : $params['duration'],
            )
        );
        unset($params['times']);
        unset($params['duration']);
        $params['token'] = $token['token'];

        return $params;
    }

    protected function getTokenService()
    {
        return $this->service('User:TokenService');
    }
}
