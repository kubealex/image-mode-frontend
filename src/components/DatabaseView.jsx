import { useState, useEffect } from 'react';
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Content,
  Label,
  Spinner,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { DatabaseIcon } from '@patternfly/react-icons';

export default function DatabaseView() {
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/schema')
      .then((r) => r.json())
      .then(setSchema)
      .catch(() => setError('Failed to load database schema'));
  }, []);

  if (error) return <Alert variant="danger" isInline title={error} />;
  if (!schema) return <Spinner aria-label="Loading schema" />;

  return (
    <div>
      <Content component="h2">Database Schema</Content>
      <Content component="p" style={{ marginBottom: '1rem' }}>
        Live schema from the PostgreSQL information_schema.
      </Content>

      {schema.map((table) => (
        <Card key={table.table_name} style={{ marginBottom: '1rem' }}>
          <CardHeader>
            <CardTitle>
              <DatabaseIcon style={{ marginRight: '0.5rem' }} />
              {table.table_name}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Table aria-label={`${table.table_name} columns`} variant="compact">
              <Thead>
                <Tr>
                  <Th>Column</Th>
                  <Th>Type</Th>
                  <Th>Nullable</Th>
                  <Th>Default</Th>
                  <Th>Constraints</Th>
                </Tr>
              </Thead>
              <Tbody>
                {table.columns.map((col) => (
                  <Tr key={col.column_name}>
                    <Td dataLabel="Column">{col.column_name}</Td>
                    <Td dataLabel="Type">
                      {col.data_type}
                      {col.character_maximum_length ? `(${col.character_maximum_length})` : ''}
                    </Td>
                    <Td dataLabel="Nullable">{col.is_nullable}</Td>
                    <Td dataLabel="Default" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {col.column_default || '—'}
                    </Td>
                    <Td dataLabel="Constraints">
                      {col.constraints?.map((c, i) => (
                        <Label
                          key={i}
                          color={c.constraint_type === 'PRIMARY KEY' ? 'blue' : 'green'}
                          isCompact
                          style={{ marginRight: '0.25rem' }}
                        >
                          {c.constraint_type}
                          {c.foreign_table_name
                            ? ` → ${c.foreign_table_name}(${c.foreign_column_name})`
                            : ''}
                        </Label>
                      ))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
