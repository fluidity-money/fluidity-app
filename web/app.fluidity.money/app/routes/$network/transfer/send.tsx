import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { debounce } from "lodash";
import { useState } from "react";
import TokenSelect from "~/components/TokenSelect";

import { Asset, useTokens } from "~/queries/useTokens";
import { useSync } from "~/util";

export const loader = async () => {
  const tokens = await useTokens();

  return json({
    tokens,
  });
};

type Contact = {
  address: string;
  name: string;
};

const Send = () => {
  const tokens =
    useLoaderData<{
      tokens: Asset[];
    }>().tokens || [];

  const [addressInput, setAddressInput] = useState("");
  const [search, setSearch] = useState("");
  const [contacts] = useSync<Contact[]>("address", []);
  const filteredContacts = contacts &&
      contacts.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase())
      ) ||
    [];

  const [, setMatch] = useState<Contact | undefined>();

  return (
    <div>
      <h1>Send</h1>
      <div className="sendform">
        <input type="text" placeholder="Enter amount" />
        <TokenSelect
          assets={tokens}
          onChange={() => {
            return;
          }}
        />
        <div className="inputrow">
          <input
            type="text"
            placeholder="Enter address, ENS or contact"
            value={addressInput}
            onChange={(e) => {
              setAddressInput(e.target.value);
              debounce((e) => {
                setSearch(e.target.value);
              }, 500);
            }}
          />
          <button
            onClick={() => {
              /**/
            }}
          >
            Send
          </button>
        </div>
      </div>
      <div className="autocomplete">
        {filteredContacts.map((contact) => (
          <div
            key={contact.address}
            onClick={() => {
              setAddressInput(contact.address);
              setMatch(contact);
            }}
          >
            <p>{contact.name}</p>
            <p>{contact.address}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Contacts</h2>
        {contacts &&
          contacts.map((contact) => (
            <div key={contact.address}>
              <p>{contact.name}</p>
              <p>{contact.address}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Send;
