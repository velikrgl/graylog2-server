// @flow strict
import * as React from 'react';
import styled from 'styled-components';
import { LinkContainer } from 'react-router-bootstrap';

import User from 'logic/users/User';
import UsersActions from 'actions/users/UsersActions';
import Routes from 'routing/Routes';
import { Button, OverlayTrigger, Tooltip, DropdownButton, MenuItem } from 'components/graylog';
import { IfPermitted } from 'components/common';

type Props = {
  readOnly: boolean,
  username: $PropertyType<User, 'username'>,
};

const ActtionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EditTokensAction = ({
  username,
  wrapperComponent: WrapperComponent,
}: {
  username: $PropertyType<Props, 'username'>,
  wrapperComponent: Button | MenuItem,
}) => (
  <LinkContainer to={Routes.SYSTEM.USERS.TOKENS.edit(encodeURIComponent(username))}>
    <WrapperComponent id={`edit-tokens-${username}`}
                      bsStyle="info"
                      bsSize="xs"
                      title={`Edit tokens of user ${username}`}>
      Edit tokens
    </WrapperComponent>
  </LinkContainer>
);

const ReadOnlyActions = ({ username }: { username: $PropertyType<Props, 'username'> }) => {
  const tooltip = <Tooltip id="system-user">System users can only be modified in the Graylog configuration file.</Tooltip>;

  return (
    <>
      <OverlayTrigger placement="left" overlay={tooltip}>
        <Button bsSize="xs" bsStyle="info" disabled>System user</Button>
      </OverlayTrigger>
      &nbsp;
      <EditTokensAction username={username} wrapperComponent={Button} />
    </>
  );
};

const EditActions = ({ username }: { username: $PropertyType<Props, 'username'> }) => {
  const _deleteUser = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Do you really want to delete user ${username}?`)) {
      UsersActions.deleteUser(username);
    }
  };

  return (
    <>
      <IfPermitted permissions={[`users:edit:${username}`]}>
        <LinkContainer to={Routes.SYSTEM.USERS.edit(encodeURIComponent(username))}>
          <Button id={`edit-user-${username}`} bsStyle="info" bsSize="xs" title={`Edit user ${username}`}>
            Edit
          </Button>
        </LinkContainer>
      </IfPermitted>
      &nbsp;
      <DropdownButton bsSize="xs" title="More actions" pullRight id={`delete-user-${username}`}>
        <EditTokensAction username={username} wrapperComponent={MenuItem} />
        <MenuItem id={`delete-user-${username}`}
                  bsStyle="primary"
                  bsSize="xs"
                  title="Delete user"
                  onClick={_deleteUser}>
          Delete
        </MenuItem>
      </DropdownButton>
    </>
  );
};

const ActionsCell = ({ username, readOnly }: Props) => {
  return (
    <td>
      <ActtionsWrapper>
        {readOnly ? (
          <ReadOnlyActions username={username} />
        ) : (
          <EditActions username={username} />
        )}
      </ActtionsWrapper>
    </td>
  );
};

export default ActionsCell;
