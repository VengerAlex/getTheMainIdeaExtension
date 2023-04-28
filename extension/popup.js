const getTheMainIdea = async (url, includeDetails) => {
    try {
        const response = await fetch("http://localhost:8080/text-completion", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({ url, includeDetails }),
        });

        const {completion} = await response.json();

        return completion;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.generate__idea');
    const details = document.getElementById('technical_details')
    const paragraph = document.querySelector('.generated-response');
    const spinner = document.querySelector('.lds-spinner')

    button.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
            const currentTabUrl = tabs[0].url
            const includeDetails = details.checked

            spinner.style.display = 'block'
            const generatedResult = await getTheMainIdea(currentTabUrl, includeDetails)
            spinner.style.display = 'none'

            paragraph.textContent = generatedResult
        });
    });
});
