import useContactList from "@/hooks/useContactList";

export default function ContactList() {
  const { contacts } = useContactList();

  return (
    <div className="h-full w-full border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Contacts ({contacts?.total})</h2>
      </div>
      <div className="overflow-y-auto">
        {contacts?.contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
          >
            <img
              src={contact.picture}
              alt={contact.name}
              className="mr-3 h-12 w-12 rounded-full object-cover"
            />
            <h3 className="font-semibold">{contact.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
