import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Content,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Icon,
  Label,
  Spinner,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';

const TIERS = [
  { key: 'frontend', name: 'Frontend', description: 'React + Vite' },
  { key: 'backend', name: 'Backend', description: 'Express + Node.js' },
  { key: 'database', name: 'Database', description: 'PostgreSQL' },
];

export default function StatusPage() {
  const [health, setHealth] = useState(null);
  const [system, setSystem] = useState(null);

  function refresh() {
    setHealth(null);
    setSystem(null);

    fetch('/api/health')
      .then((r) => r.json())
      .then((data) =>
        setHealth({
          frontend: { status: 'ok' },
          backend: data.backend,
          database: data.database,
        })
      )
      .catch(() =>
        setHealth({
          frontend: { status: 'ok' },
          backend: { status: 'error', error: 'Cannot reach backend' },
          database: { status: 'error', error: 'Cannot reach backend' },
        })
      );

    fetch('/api/system')
      .then((r) => r.json())
      .then(setSystem)
      .catch(() => setSystem(null));
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <Content component="h2">System Status</Content>

      {system && (
        <Card style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
          <CardHeader>
            <CardTitle>Image Mode Info</CardTitle>
          </CardHeader>
          <CardBody>
            <DescriptionList isHorizontal>
              <DescriptionListGroup>
                <DescriptionListTerm>Operating System</DescriptionListTerm>
                <DescriptionListDescription>
                  {system.os?.pretty || 'Unknown'}
                </DescriptionListDescription>
              </DescriptionListGroup>

              {system.bootc && (
                <>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Booted Image</DescriptionListTerm>
                    <DescriptionListDescription>
                      {system.bootc.image}
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Image Digest</DescriptionListTerm>
                    <DescriptionListDescription style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                      {system.bootc.imageDigest?.substring(0, 19)}...
                    </DescriptionListDescription>
                  </DescriptionListGroup>

                  <DescriptionListGroup>
                    <DescriptionListTerm>Updates</DescriptionListTerm>
                    <DescriptionListDescription>
                      {system.bootc.updateAvailable ? (
                        <Label color="gold" icon={<ExclamationTriangleIcon />}>Update available</Label>
                      ) : (
                        <Label color="green" icon={<CheckCircleIcon />}>Up to date</Label>
                      )}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </>
              )}

              {!system.bootc && (
                <DescriptionListGroup>
                  <DescriptionListTerm>bootc</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Label color="grey">Not available</Label>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              )}
            </DescriptionList>
          </CardBody>
        </Card>
      )}

      {!health ? (
        <Spinner aria-label="Checking health" />
      ) : (
        <>
          <Flex gap={{ default: 'gapLg' }} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            {TIERS.map((tier) => {
              const data = health[tier.key];
              const isOk = data?.status === 'ok';

              return (
                <FlexItem key={tier.key} style={{ minWidth: 220 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <FlexItem>
                            {isOk ? (
                              <Icon status="success"><CheckCircleIcon /></Icon>
                            ) : (
                              <Icon status="danger"><ExclamationCircleIcon /></Icon>
                            )}
                          </FlexItem>
                          <FlexItem>{tier.name}</FlexItem>
                        </Flex>
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Content component="p">{tier.description}</Content>
                      <Content component="p" style={{ marginTop: '0.5rem' }}>
                        <strong>Status:</strong> {isOk ? 'Healthy' : data?.error || 'Unhealthy'}
                      </Content>
                    </CardBody>
                  </Card>
                </FlexItem>
              );
            })}
          </Flex>

          <Button variant="secondary" onClick={refresh}>Refresh</Button>
        </>
      )}
    </div>
  );
}
