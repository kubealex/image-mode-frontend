import { useState, useEffect } from 'react';
import {
  Alert,
  Content,
  Label,
  Spinner,
  ToggleGroup,
  ToggleGroupItem,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Icon,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { TrainIcon } from '@patternfly/react-icons';

const TRAIN_TYPE_COLORS = {
  Frecciarossa: 'red',
  Frecciargento: 'grey',
  Intercity: 'blue',
  Regionale: 'green',
};

const TRAIN_TYPE_LABELS = {
  Frecciarossa: 'FR',
  Frecciargento: 'FA',
  Intercity: 'IC',
  Regionale: 'R',
};

export default function Timetable() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetch('/api/timetable')
      .then((r) => r.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load timetable');
        setLoading(false);
      });
  }, []);

  const types = [...new Set(entries.map((e) => e.train_type))];
  const filtered = activeFilter === 'all'
    ? entries
    : entries.filter((e) => e.train_type === activeFilter);

  if (error) return <Alert variant="danger" isInline title={error} />;

  return (
    <div>
      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} style={{ marginBottom: '1rem' }}>
        <FlexItem>
          <Content component="h2" style={{ margin: 0 }}>
            <Icon style={{ marginRight: '0.5rem' }}><TrainIcon /></Icon>
            Train Timetable
          </Content>
        </FlexItem>
      </Flex>

      <Content component="p" style={{ marginBottom: '1rem', color: 'var(--pf-t--global--color--300)' }}>
        Browse all scheduled train services across the Italian rail network.
      </Content>

      {loading ? (
        <Spinner aria-label="Loading timetable" />
      ) : (
        <>
          <ToggleGroup aria-label="Filter by train type" style={{ marginBottom: '1rem' }}>
            <ToggleGroupItem
              text="All"
              isSelected={activeFilter === 'all'}
              onChange={() => setActiveFilter('all')}
            />
            {types.map((type) => (
              <ToggleGroupItem
                key={type}
                text={type}
                isSelected={activeFilter === type}
                onChange={() => setActiveFilter(type)}
              />
            ))}
          </ToggleGroup>

          <Card>
            <CardBody style={{ padding: 0 }}>
              <Table aria-label="Timetable" variant="compact" isStickyHeader>
                <Thead>
                  <Tr>
                    <Th>Train</Th>
                    <Th>Type</Th>
                    <Th>From</Th>
                    <Th>To</Th>
                    <Th>Departure</Th>
                    <Th>Arrival</Th>
                    <Th>Base Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filtered.map((entry, i) => (
                    <Tr key={i}>
                      <Td dataLabel="Train" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {entry.train_number}
                      </Td>
                      <Td dataLabel="Type">
                        <Label isCompact color={TRAIN_TYPE_COLORS[entry.train_type]}>
                          {entry.train_type}
                        </Label>
                      </Td>
                      <Td dataLabel="From">
                        {entry.source_station}{' '}
                        <span style={{ color: 'var(--pf-t--global--color--300)', fontSize: '0.85rem' }}>
                          ({entry.source_code})
                        </span>
                      </Td>
                      <Td dataLabel="To">
                        {entry.destination_station}{' '}
                        <span style={{ color: 'var(--pf-t--global--color--300)', fontSize: '0.85rem' }}>
                          ({entry.destination_code})
                        </span>
                      </Td>
                      <Td dataLabel="Departure" style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1rem' }}>
                        {entry.departure_time}
                      </Td>
                      <Td dataLabel="Arrival" style={{ fontFamily: 'monospace', fontSize: '1rem' }}>
                        {entry.arrival_time}
                      </Td>
                      <Td dataLabel="Base Price" style={{ fontWeight: 600 }}>
                        {Number(entry.base_price).toFixed(2)} EUR
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>

          <Content component="p" style={{ marginTop: '0.75rem', color: 'var(--pf-t--global--color--300)', fontSize: '0.85rem' }}>
            Showing {filtered.length} of {entries.length} services
          </Content>
        </>
      )}
    </div>
  );
}
