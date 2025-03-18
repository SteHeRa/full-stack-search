import { getCodeSandboxHost } from "@codesandbox/utils";

async function getResource<T>(
  collection: string,
  id: string,
  setter: React.Dispatch<T>
) {
  const codeSandboxHost = getCodeSandboxHost(3001);
  const API_URL = codeSandboxHost
    ? `https://${codeSandboxHost}`
    : "http://localhost:3001";

  const resource = await fetch(`${API_URL}/${collection}/${id}`);
  setter((await resource.json()) as T);
}

export default getResource;
