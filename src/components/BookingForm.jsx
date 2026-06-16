import { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  Button,
  Alert,
  ActionGroup,
  Content,
  Label,
  Spinner,
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

const TRAIN_TYPE_COLORS = {
  Frecciarossa: 'red',
  Frecciargento: 'grey',
  Intercity: 'blue',
  Regionale: 'green',
};

export default function BookingForm() {
  const [stations, setStations] = useState([]);
  const [sourceStationId, setSourceStationId] = useState('');
  const [destinationStationId, setDestinationStationId] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  const [availableTrains, setAvailableTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [loadingTrains, setLoadingTrains] = useState(false);

  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/stations')
      .then((r) => r.json())
      .then(setStations)
      .catch(() => setError('Failed to load stations'));
  }, []);

  useEffect(() => {
    if (!sourceStationId || !destinationStationId || sourceStationId === destinationStationId) {
      setAvailableTrains([]);
      setSelectedTrain(null);
      return;
    }
    setLoadingTrains(true);
    setError(null);
    fetch(`/api/trains?source_station_id=${sourceStationId}&destination_station_id=${destinationStationId}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailableTrains(data);
        setSelectedTrain(null);
      })
      .catch(() => setError('Failed to load trains for this route'))
      .finally(() => setLoadingTrains(false));
  }, [sourceStationId, destinationStationId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setConfirmation(null);

    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        train_number: selectedTrain.train_number,
        train_type: selectedTrain.train_type,
        source_station_id: Number(sourceStationId),
        destination_station_id: Number(destinationStationId),
        departure_date: departureDate,
        departure_time: selectedTrain.departure_time,
        customer_first_name: customerFirstName,
        customer_last_name: customerLastName,
        customer_email: customerEmail,
        price: Number(selectedTrain.price),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Booking failed');
      return;
    }

    const ticket = await res.json();
    setConfirmation(ticket);
    setSourceStationId('');
    setDestinationStationId('');
    setDepartureDate('');
    setAvailableTrains([]);
    setSelectedTrain(null);
    setCustomerFirstName('');
    setCustomerLastName('');
    setCustomerEmail('');
  }

  const showTrains = sourceStationId && destinationStationId && sourceStationId !== destinationStationId;

  return (
    <div style={{ maxWidth: 800 }}>
      <Content component="h2">Book a Ticket</Content>

      {error && (
        <Alert variant="danger" isInline title={error} style={{ marginBottom: '1rem' }} />
      )}

      {confirmation && (
        <Alert variant="success" isInline title="Ticket booked!" style={{ marginBottom: '1rem' }}>
          <strong>Ticket ID:</strong> {confirmation.id}
        </Alert>
      )}

      <Form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 500 }}>
        <FormGroup label="From" isRequired fieldId="source">
          <FormSelect
            id="source"
            value={sourceStationId}
            onChange={(_e, val) => setSourceStationId(val)}
            isRequired
          >
            <FormSelectOption value="" label="Select station" isPlaceholder />
            {stations.map((s) => (
              <FormSelectOption key={s.id} value={String(s.id)} label={s.name} />
            ))}
          </FormSelect>
        </FormGroup>

        <FormGroup label="To" isRequired fieldId="destination">
          <FormSelect
            id="destination"
            value={destinationStationId}
            onChange={(_e, val) => setDestinationStationId(val)}
            isRequired
          >
            <FormSelectOption value="" label="Select station" isPlaceholder />
            {stations.map((s) => (
              <FormSelectOption key={s.id} value={String(s.id)} label={s.name} />
            ))}
          </FormSelect>
        </FormGroup>

        <FormGroup label="Date" isRequired fieldId="departure-date">
          <TextInput
            type="date"
            id="departure-date"
            value={departureDate}
            onChange={(_e, val) => setDepartureDate(val)}
            isRequired
          />
        </FormGroup>
      </Form>

      {loadingTrains && <Spinner size="lg" style={{ marginTop: '1rem' }} />}

      {showTrains && !loadingTrains && availableTrains.length === 0 && (
        <EmptyState icon={SearchIcon} titleText="No trains available" headingLevel="h3" style={{ marginTop: '1rem' }}>
          <EmptyStateBody>
            There are no direct trains for this route. Try a different station pair.
          </EmptyStateBody>
        </EmptyState>
      )}

      {showTrains && availableTrains.length > 0 && (
        <>
          <Content component="h3" style={{ marginTop: '1.5rem' }}>Available Trains</Content>
          <Table aria-label="Available trains" variant="compact">
            <Thead>
              <Tr>
                <Th>Train</Th>
                <Th>Type</Th>
                <Th>Departure</Th>
                <Th>Arrival</Th>
                <Th>Price</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {availableTrains.map((train) => (
                <Tr
                  key={train.id}
                  isSelectable
                  isSelected={selectedTrain?.id === train.id}
                  onRowClick={() => setSelectedTrain(train)}
                >
                  <Td dataLabel="Train" style={{ fontFamily: 'monospace' }}>
                    {train.train_number}
                  </Td>
                  <Td dataLabel="Type">
                    <Label isCompact color={TRAIN_TYPE_COLORS[train.train_type]}>
                      {train.train_type}
                    </Label>
                  </Td>
                  <Td dataLabel="Departure">{train.departure_time?.slice(0, 5)}</Td>
                  <Td dataLabel="Arrival">{train.arrival_time?.slice(0, 5)}</Td>
                  <Td dataLabel="Price">{Number(train.price).toFixed(2)} EUR</Td>
                  <Td>
                    <Button
                      variant={selectedTrain?.id === train.id ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedTrain(train)}
                    >
                      {selectedTrain?.id === train.id ? 'Selected' : 'Select'}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}

      {selectedTrain && departureDate && (
        <Form onSubmit={handleSubmit} style={{ maxWidth: 500, marginTop: '1.5rem' }}>
          <Content component="h3">Passenger Details</Content>
          <Content component="p" style={{ marginBottom: '1rem' }}>
            <Label isCompact color={TRAIN_TYPE_COLORS[selectedTrain.train_type]}>
              {selectedTrain.train_type}
            </Label>{' '}
            {selectedTrain.train_number} &mdash; Departure{' '}
            {selectedTrain.departure_time?.slice(0, 5)} &mdash;{' '}
            <strong>{Number(selectedTrain.price).toFixed(2)} EUR</strong>
          </Content>

          <FormGroup label="First Name" isRequired fieldId="first-name">
            <TextInput
              id="first-name"
              value={customerFirstName}
              onChange={(_e, val) => setCustomerFirstName(val)}
              isRequired
            />
          </FormGroup>

          <FormGroup label="Last Name" isRequired fieldId="last-name">
            <TextInput
              id="last-name"
              value={customerLastName}
              onChange={(_e, val) => setCustomerLastName(val)}
              isRequired
            />
          </FormGroup>

          <FormGroup label="Email" isRequired fieldId="email">
            <TextInput
              type="email"
              id="email"
              value={customerEmail}
              onChange={(_e, val) => setCustomerEmail(val)}
              isRequired
            />
          </FormGroup>

          <ActionGroup>
            <Button
              type="submit"
              variant="primary"
              isDisabled={!customerFirstName || !customerLastName || !customerEmail}
            >
              Book Ticket
            </Button>
          </ActionGroup>
        </Form>
      )}
    </div>
  );
}
