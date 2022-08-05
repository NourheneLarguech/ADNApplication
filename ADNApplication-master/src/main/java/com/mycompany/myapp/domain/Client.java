package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Statut;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "uid_client")
    private String uidClient;

    @Column(name = "name_client")
    private String nameClient;

    @Column(name = "product_client")
    private String productClient;

    @Column(name = "comment")
    private String comment;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private Statut statut;

    @ManyToOne
    @JsonIgnoreProperties(value = { "versionApplicables", "versionCibles", "updates" }, allowSetters = true)
    private Product client_product;

    @ManyToOne
    @JsonIgnoreProperties(value = { "updates", "product" }, allowSetters = true)
    private VersionApplicable versionApplicable;

    @ManyToOne
    @JsonIgnoreProperties(value = { "updates", "product" }, allowSetters = true)
    private VersionCible versionCible;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUidClient() {
        return this.uidClient;
    }

    public Client uidClient(String uidClient) {
        this.setUidClient(uidClient);
        return this;
    }

    public void setUidClient(String uidClient) {
        this.uidClient = uidClient;
    }

    public String getNameClient() {
        return this.nameClient;
    }

    public Client nameClient(String nameClient) {
        this.setNameClient(nameClient);
        return this;
    }

    public void setNameClient(String nameClient) {
        this.nameClient = nameClient;
    }

    public String getProductClient() {
        return this.productClient;
    }

    public Client productClient(String productClient) {
        this.setProductClient(productClient);
        return this;
    }

    public void setProductClient(String productClient) {
        this.productClient = productClient;
    }

    public String getComment() {
        return this.comment;
    }

    public Client comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getDescription() {
        return this.description;
    }

    public Client description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Statut getStatut() {
        return this.statut;
    }

    public Client statut(Statut statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }

    public Product getClient_product() {
        return this.client_product;
    }

    public void setClient_product(Product product) {
        this.client_product = product;
    }

    public Client client_product(Product product) {
        this.setClient_product(product);
        return this;
    }

    public VersionApplicable getVersionApplicable() {
        return this.versionApplicable;
    }

    public void setVersionApplicable(VersionApplicable versionApplicable) {
        this.versionApplicable = versionApplicable;
    }

    public Client versionApplicable(VersionApplicable versionApplicable) {
        this.setVersionApplicable(versionApplicable);
        return this;
    }

    public VersionCible getVersionCible() {
        return this.versionCible;
    }

    public void setVersionCible(VersionCible versionCible) {
        this.versionCible = versionCible;
    }

    public Client versionCible(VersionCible versionCible) {
        this.setVersionCible(versionCible);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return id != null && id.equals(((Client) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", uidClient='" + getUidClient() + "'" +
            ", nameClient='" + getNameClient() + "'" +
            ", productClient='" + getProductClient() + "'" +
            ", comment='" + getComment() + "'" +
            ", description='" + getDescription() + "'" +
            ", statut='" + getStatut() + "'" +
            "}";
    }
}
