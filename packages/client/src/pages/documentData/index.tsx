import { useEffect, useState } from "react";
import { useParams } from "react-router";
import getResource from "../../services/getResource";
import { City, Country, Hotel } from "../../app";

const DocumentData = () => {
  const params = useParams();
  const [documentDataKeys, setDocumentDataKeys] = useState<string[]>([]);

  const [document, setDocument] = useState<City | Country | Hotel | null>(null);

  useEffect(() => {
    switch (params.collection) {
      case "cities":
        setDocumentDataKeys(["name"]);
        break;
      case "countries":
        setDocumentDataKeys(["country"]);
        break;
      case "hotels":
        setDocumentDataKeys(["hotel_name"]);
        break;
      default:
        break;
    }

    if (params.collection && params.id) {
      getResource(params.collection, params.id, setDocument);
    }
  }, [params.collection, params.id]);

  return (
    <div className="DocumentData">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-8 text-center">
            {document
              ? documentDataKeys.map((key, i) => (
                  <h1 key={`document_${key}_${i}`}>
                    {document[key as keyof typeof document]}
                  </h1>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentData;
