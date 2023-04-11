import CardMobile from "@/components/cards/deal/CardMobile";
import FileStatus from "./FileStatus";


function CustomerCard({ id, name, status, size, onClickFileView, onClickDelete, isFiles, onClick }) {
    return (
      <>
        <CardMobile
          name={name}
          size={size}
          id={id}
          isFiles={isFiles}
          onClickFileView={() => isFiles ? onClickFileView : (window.location.href = '/files/' + id)}
          onClickDelete={onClickDelete}
          stat={FileStatus(status)}
          onClick={onClick}
        />
      </>
    );
  };


  const CustomerList = ({ data, onClickFileView, onClickDelete, isFiles = true, onClick }) => {
    return (
      <div>
        {data.map((customer) => (
          <CustomerCard
            key={customer.id}
            id={customer.id}
            name={customer.name}
            status={customer.status}
            size={customer.size + ' GiB'}
            onClickFileView={onClickFileView}
            onClickDelete={onClickDelete}
            isFiles={isFiles}
            onClick={onClick}
          />
        ))}
      </div>
    );
  };

  export default CustomerList;