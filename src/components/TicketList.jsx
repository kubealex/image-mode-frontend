import { useState, useEffect } from 'react';
import { Alert, Button, Content, EmptyState, EmptyStateBody, Label } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  function loadTickets() {
    fetch('/api/tickets')
      .then((r) => r.json())
      .then(setTickets)
      .catch(() => setError('Failed to load tickets'));
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTickets(tickets.filter((t) => t.id !== id));
    }
  }

  if (error) return <Alert variant="danger" isInline title={error} />;

  return (
    <div>
      <Content component="h2">All Tickets</Content>

      {tickets.length === 0 ? (
        <EmptyState headingLevel="h3" titleText="No tickets yet" icon={SearchIcon}>
          <EmptyStateBody>Book your first ticket to see it here.</EmptyStateBody>
        </EmptyState>
      ) : (
        <Table aria-label="Tickets table" variant="compact">
          <Thead>
            <Tr>
              <Th>Ticket ID</Th>
              <Th>Train</Th>
              <Th>Type</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Customer</Th>
              <Th>Email</Th>
              <Th>Price</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {tickets.map((t) => (
              <Tr key={t.id}>
                <Td dataLabel="Ticket ID" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {t.id}
                </Td>
                <Td dataLabel="Train" style={{ fontFamily: 'monospace' }}>
                  {t.train_number || '—'}
                </Td>
                <Td dataLabel="Type">
                  {t.train_type ? <Label isCompact>{t.train_type}</Label> : '—'}
                </Td>
                <Td dataLabel="From">{t.source_station_name}</Td>
                <Td dataLabel="To">{t.destination_station_name}</Td>
                <Td dataLabel="Date">{t.departure_date?.slice(0, 10)}</Td>
                <Td dataLabel="Time">{t.departure_time?.slice(0, 5)}</Td>
                <Td dataLabel="Customer">
                  {t.customer_first_name} {t.customer_last_name}
                </Td>
                <Td dataLabel="Email">{t.customer_email}</Td>
                <Td dataLabel="Price">{t.price} EUR</Td>
                <Td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
