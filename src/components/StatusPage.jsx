import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Content,
  Flex,
  FlexItem,
  Icon,
  Spinner,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

const TIERS = [
  { key: 'frontend', name: 'Frontend', description: 'React + Vite' },
  { key: 'backend', name: 'Backend', description: 'Express + Node.js' },
  { key: 'database', name: 'Database', description: 'PostgreSQL' },
];

export default function StatusPage() {
  const [health, setHealth] = useState(null);

  function checkHealth() {
    setHealth(null);
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
  }

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div>
      <Content component="h2">System Status</Content>

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

          <Button variant="secondary" onClick={checkHealth}>Refresh</Button>
        </>
      )}
    </div>
  );
}
