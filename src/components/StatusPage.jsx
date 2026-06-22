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
  Divider,
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

function BootcInfo({ bootc }) {
  if (!bootc) {
    return (
      <DescriptionList isCompact isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>bootc</DescriptionListTerm>
          <DescriptionListDescription>
            <Label color="grey">Not available</Label>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    );
  }

  return (
    <DescriptionList isCompact isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>Image</DescriptionListTerm>
        <DescriptionListDescription style={{ fontFamily: 'monospace', fontSize: '0.85em', wordBreak: 'break-all' }}>
          {bootc.image}
        </DescriptionListDescription>
      </DescriptionListGroup>

      <DescriptionListGroup>
        <DescriptionListTerm>Digest</DescriptionListTerm>
        <DescriptionListDescription style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>
          {bootc.imageDigest?.substring(0, 19)}...
        </DescriptionListDescription>
      </DescriptionListGroup>

      {bootc.version && (
        <DescriptionListGroup>
          <DescriptionListTerm>OS Version</DescriptionListTerm>
          <DescriptionListDescription>{bootc.version}</DescriptionListDescription>
        </DescriptionListGroup>
      )}

      {bootc.architecture && (
        <DescriptionListGroup>
          <DescriptionListTerm>Arch</DescriptionListTerm>
          <DescriptionListDescription>{bootc.architecture}</DescriptionListDescription>
        </DescriptionListGroup>
      )}

      <DescriptionListGroup>
        <DescriptionListTerm>Updates</DescriptionListTerm>
        <DescriptionListDescription>
          {bootc.updateAvailable ? (
            <Label color="gold" icon={<ExclamationTriangleIcon />}>
              Update available{bootc.updateVersion ? ` (${bootc.updateVersion})` : ''}
            </Label>
          ) : (
            <Label color="green" icon={<CheckCircleIcon />}>Up to date</Label>
          )}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}

export default function StatusPage() {
  const [health, setHealth] = useState(null);
  const [bootcStatus, setBootcStatus] = useState({});

  function refresh() {
    setHealth(null);
    setBootcStatus({});

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

    fetchFrontendBootcStatus();
    fetchBackendDbBootcStatus();
  }

  async function fetchFrontendBootcStatus() {
    try {
      const [bootedRes, updateRes] = await Promise.all([
        fetch('/bootc-status/booted'),
        fetch('/bootc-status/update-available'),
      ]);
      if (!bootedRes.ok) {
        setBootcStatus((prev) => ({ ...prev, frontend: null }));
        return;
      }
      const booted = await bootedRes.json();
      const update = updateRes.ok ? await updateRes.json() : null;
      setBootcStatus((prev) => ({
        ...prev,
        frontend: {
          image: booted.image?.image?.image || '',
          imageDigest: booted.image?.imageDigest || '',
          version: booted.image?.version || '',
          architecture: booted.image?.architecture || '',
          timestamp: booted.image?.timestamp || '',
          updateAvailable: update?.update_available || false,
          updateVersion: update?.update_version || null,
        },
      }));
    } catch {
      setBootcStatus((prev) => ({ ...prev, frontend: null }));
    }
  }

  async function fetchBackendDbBootcStatus() {
    try {
      const res = await fetch('/api/bootc-status');
      if (!res.ok) return;
      const data = await res.json();
      setBootcStatus((prev) => ({
        ...prev,
        backend: data.backend || null,
        database: data.database || null,
      }));
    } catch {
      setBootcStatus((prev) => ({ ...prev, backend: null, database: null }));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <Content component="h2">System Status</Content>

      {!health ? (
        <Spinner aria-label="Checking health" />
      ) : (
        <>
          <Flex
            direction={{ default: 'column', lg: 'row' }}
            gap={{ default: 'gapLg' }}
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
          >
            {TIERS.map((tier) => {
              const data = health[tier.key];
              const isOk = data?.status === 'ok';
              const bootc = bootcStatus[tier.key];

              return (
                <FlexItem key={tier.key} flex={{ default: 'flex_1' }} style={{ minWidth: 280 }}>
                  <Card isFullHeight>
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

                      <Divider style={{ marginTop: '1rem', marginBottom: '1rem' }} />

                      <Content component="h4" style={{ marginBottom: '0.5rem' }}>Image Mode</Content>
                      {bootc === undefined ? (
                        <Spinner size="md" aria-label="Loading bootc status" />
                      ) : (
                        <BootcInfo bootc={bootc} />
                      )}
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
