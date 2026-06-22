import { useState } from 'react';
import {
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadLogo,
  MastheadContent,
  Nav,
  NavList,
  NavItem,
} from '@patternfly/react-core';
import BookingForm from './components/BookingForm';
import TicketList from './components/TicketList';
import Timetable from './components/Timetable';
import DatabaseView from './components/DatabaseView';
import StatusPage from './components/StatusPage';

const NAV_ITEMS = [
  { id: 'book', label: 'Book Ticket' },
  { id: 'timetable', label: 'Timetable' },
  { id: 'list', label: 'My Tickets' },
  { id: 'schema', label: 'Database' },
  { id: 'status', label: 'Status' },
];

const RED_HAT_LOGO_SVG = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#e00" d="M16.009 13.386c1.577 0 3.86-.326 3.86-2.202a1.765 1.765 0 0 0-.04-.431l-.94-4.08c-.216-.898-.406-1.305-1.982-2.093-1.223-.625-3.888-1.658-4.676-1.658-.733 0-.947.946-1.822.946-.842 0-1.467-.706-2.255-.706-.757 0-1.25.515-1.63 1.576 0 0-1.06 2.99-1.197 3.424a.81.81 0 0 0-.028.245c0 1.162 4.577 4.974 10.71 4.974m4.101-1.435c.218 1.032.218 1.14.218 1.277 0 1.765-1.984 2.745-4.593 2.745-5.895.004-11.06-3.451-11.06-5.734a2.326 2.326 0 0 1 .19-.925C2.746 9.415 0 9.794 0 12.217c0 3.969 9.405 8.861 16.851 8.861 5.71 0 7.149-2.582 7.149-4.62 0-1.605-1.387-3.425-3.887-4.512"/></svg>')}`;

export default function App() {
  const [activeItem, setActiveItem] = useState('book');

  const masthead = (
    <Masthead style={{ backgroundColor: '#151515' }}>
      <MastheadMain>
        <MastheadBrand>
          <MastheadLogo component="div">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={RED_HAT_LOGO_SVG} alt="Red Hat" width="40" height="40" />
              <span style={{ color: '#fff', fontSize: '22px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Image Mode Train Service
              </span>
            </div>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent />
    </Masthead>
  );

  const sidebarStyle = `
    .app-sidebar .pf-v6-c-page__sidebar-body {
      background-color: #151515;
    }
    .app-sidebar .pf-v6-c-nav__link {
      color: #c9c9c9;
      font-size: 18px;
      padding: 18px 24px;
    }
    .app-sidebar .pf-v6-c-nav {
      --pf-v6-c-nav__item--accent--color: #ee0000;
      --pf-v6-c-nav__link--m-current--BackgroundColor: transparent;
      --pf-v6-c-nav__link--m-current--Color: #fff;
    }
    .app-sidebar .pf-v6-c-nav__link:hover {
      color: #fff;
      background-color: #2b2b2b;
    }
  `;

  const sidebar = (
    <PageSidebar className="app-sidebar">
      <style>{sidebarStyle}</style>
      <PageSidebarBody>
        <Nav onSelect={(_e, result) => setActiveItem(result.itemId)}>
          <NavList>
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.id} itemId={item.id} isActive={activeItem === item.id}>
                {item.label}
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page masthead={masthead} sidebar={sidebar}>
      <PageSection style={{ '--pf-t--global--font--size--body--default': '16px', '--pf-t--global--font--size--heading--h1': '28px', '--pf-t--global--font--size--heading--h2': '24px', '--pf-t--global--font--size--heading--h3': '20px', '--pf-t--global--font--size--heading--h4': '18px', fontSize: '16px' }}>
        {activeItem === 'book' && <BookingForm />}
        {activeItem === 'timetable' && <Timetable />}
        {activeItem === 'list' && <TicketList />}
        {activeItem === 'schema' && <DatabaseView />}
        {activeItem === 'status' && <StatusPage />}
      </PageSection>
    </Page>
  );
}
