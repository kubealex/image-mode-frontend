import { useState } from 'react';
import {
  Page,
  PageSection,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadLogo,
  MastheadContent,
  Nav,
  NavList,
  NavItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import BookingForm from './components/BookingForm';
import TicketList from './components/TicketList';
import DatabaseView from './components/DatabaseView';
import StatusPage from './components/StatusPage';

export default function App() {
  const [activeItem, setActiveItem] = useState('book');

  const nav = (
    <Nav onSelect={(_e, result) => setActiveItem(result.itemId)} variant="horizontal">
      <NavList>
        <NavItem itemId="book" isActive={activeItem === 'book'}>Book Ticket</NavItem>
        <NavItem itemId="list" isActive={activeItem === 'list'}>My Tickets</NavItem>
        <NavItem itemId="schema" isActive={activeItem === 'schema'}>Database</NavItem>
        <NavItem itemId="status" isActive={activeItem === 'status'}>Status</NavItem>
      </NavList>
    </Nav>
  );

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <MastheadLogo>Train Tickets</MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>{nav}</ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );

  return (
    <Page masthead={masthead}>
      <PageSection>
        {activeItem === 'book' && <BookingForm />}
        {activeItem === 'list' && <TicketList />}
        {activeItem === 'schema' && <DatabaseView />}
        {activeItem === 'status' && <StatusPage />}
      </PageSection>
    </Page>
  );
}
